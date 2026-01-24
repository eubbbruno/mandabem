import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { title, description, theme, prize, locationId, startsAt, endsAt, rules } = await request.json()

    // Valida dados
    if (!title || !description || !theme || !prize || !locationId || !startsAt || !endsAt || !rules) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Cria desafio
    const { data: challenge, error: insertError } = await supabase
      .from('challenges')
      .insert({
        title,
        description,
        theme,
        prize,
        location_id: locationId,
        starts_at: startsAt,
        ends_at: endsAt,
        rules,
        status: 'active'
      } as any)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ 
      success: true,
      challenge
    })

  } catch (error: any) {
    console.error('Create challenge error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar desafio' },
      { status: 500 }
    )
  }
}
