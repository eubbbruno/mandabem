import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { calculatePrice } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verifica autenticação
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const challengeId = formData.get('challengeId') as string
    const contentType = formData.get('contentType') as 'photo' | 'text'
    const attemptNumber = parseInt(formData.get('attemptNumber') as string)
    const paymentAmount = parseFloat(formData.get('paymentAmount') as string)

    // Valida dados
    if (!challengeId || !contentType || !attemptNumber) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Verifica se desafio existe e está ativo
    const { data: challenge }: { data: any } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single()

    if (!challenge || challenge.status !== 'active') {
      return NextResponse.json(
        { error: 'Desafio não disponível' },
        { status: 400 }
      )
    }

    // Calcula preço correto
    const correctPrice = calculatePrice(attemptNumber)
    if (Math.abs(paymentAmount - correctPrice) > 0.01) {
      return NextResponse.json(
        { error: 'Preço inválido' },
        { status: 400 }
      )
    }

    let contentUrl = null
    let contentText = null

    // Processa conteúdo
    if (contentType === 'photo') {
      const photoFile = formData.get('photo') as File
      if (!photoFile) {
        return NextResponse.json(
          { error: 'Foto não enviada' },
          { status: 400 }
        )
      }

      // Upload para Supabase Storage
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${user.id}/${challengeId}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(fileName, photoFile)

      if (uploadError) {
        throw uploadError
      }

      // Pega URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(fileName)

      contentUrl = publicUrl
    } else {
      contentText = formData.get('contentText') as string
      if (!contentText) {
        return NextResponse.json(
          { error: 'Texto não enviado' },
          { status: 400 }
        )
      }
    }

    // Cria submission
    const { data: submission, error: insertError }: { data: any, error: any } = await supabase
      .from('submissions')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        content_type: contentType,
        content_url: contentUrl,
        content_text: contentText,
        payment_amount: paymentAmount,
        attempt_number: attemptNumber,
        status: 'pending_payment'
      } as any)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ 
      success: true,
      submissionId: submission.id
    })

  } catch (error: any) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar participação' },
      { status: 500 }
    )
  }
}
