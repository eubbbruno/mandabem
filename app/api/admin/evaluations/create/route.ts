import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verifica autenticação (em produção, verificar se é jurado)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { submissionId, strategy, engagement, adequacy, execution, creativity, notes } = await request.json()

    // Valida dados
    if (!submissionId) {
      return NextResponse.json(
        { error: 'ID da submissão é obrigatório' },
        { status: 400 }
      )
    }

    const scores = [strategy, engagement, adequacy, execution, creativity]
    if (scores.some(s => s < 0 || s > 10)) {
      return NextResponse.json(
        { error: 'Todos os scores devem estar entre 0 e 10' },
        { status: 400 }
      )
    }

    // Busca ou cria jurado (mock - em produção seria gerenciado)
    let { data: judge }: { data: any } = await supabase
      .from('judges')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!judge) {
      const { data: newJudge, error: judgeError } = await supabase
        .from('judges')
        .insert({ user_id: user.id, active: true } as any)
        .select()
        .single()

      if (judgeError) {
        throw judgeError
      }
      judge = newJudge
    }

    // Verifica se já avaliou esta submissão
    const { data: existingEval } = await supabase
      .from('evaluations')
      .select('*')
      .eq('submission_id', submissionId)
      .eq('judge_id', judge!.id)
      .single()

    if (existingEval) {
      return NextResponse.json(
        { error: 'Você já avaliou esta participação' },
        { status: 400 }
      )
    }

    // Cria avaliação
    const { data: evaluation, error: insertError } = await supabase
      .from('evaluations')
      .insert({
        submission_id: submissionId,
        judge_id: judge!.id,
        strategy,
        engagement,
        adequacy,
        execution,
        creativity,
        notes
      } as any)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // O trigger no banco vai calcular o score automaticamente
    return NextResponse.json({ 
      success: true,
      evaluation
    })

  } catch (error: any) {
    console.error('Create evaluation error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar avaliação' },
      { status: 500 }
    )
  }
}
