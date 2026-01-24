import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { name, address, city } = await request.json()

    // Valida dados
    if (!name || !address || !city) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Cria local
    const { data: location, error: insertError } = await supabase
      .from('locations')
      .insert({
        name,
        address,
        city,
        active: true
      } as any)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ 
      success: true,
      location
    })

  } catch (error: any) {
    console.error('Create location error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar local' },
      { status: 500 }
    )
  }
}
