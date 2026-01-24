import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { submissionId, paymentMethod } = await request.json()

    const supabase = await createClient()

    // Verifica autenticação
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Valida dados
    if (!submissionId) {
      return NextResponse.json(
        { error: 'ID da submissão é obrigatório' },
        { status: 400 }
      )
    }

    // Busca submission
    const { data: submission }: { data: any } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('user_id', user.id)
      .single()

    if (!submission) {
      return NextResponse.json(
        { error: 'Participação não encontrada' },
        { status: 404 }
      )
    }

    if (submission.status !== 'pending_payment') {
      return NextResponse.json(
        { error: 'Pagamento já processado' },
        { status: 400 }
      )
    }

    // Em produção, aqui seria feita a integração com Mercado Pago
    // Para MVP, apenas simula o pagamento
    const mockPaymentId = `PIX_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    // Atualiza status para pago
    const updateData: any = {
      status: 'paid',
      payment_id: mockPaymentId
    }
    const { error: updateError } = await supabase
      .from('submissions')
      // @ts-ignore - Supabase type inference issue
      .update(updateData)
      .eq('id', submissionId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ 
      success: true,
      paymentId: mockPaymentId,
      message: 'Pagamento confirmado! Sua participação será avaliada em breve.'
    })

  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao confirmar pagamento' },
      { status: 500 }
    )
  }
}
