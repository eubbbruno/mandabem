import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateCPF } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const { email, cpf, name } = await request.json()

    // Valida dados
    if (!email || !cpf || !name) {
      return NextResponse.json(
        { error: 'Email, CPF e nome são obrigatórios' },
        { status: 400 }
      )
    }

    if (!validateCPF(cpf)) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verifica se usuário já existe pelo CPF
    const { data: existingUser }: { data: any } = await supabase
      .from('users')
      .select('*')
      .eq('cpf', cpf)
      .single()

    if (existingUser) {
      // Faz login com email magic link
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: existingUser.email,
        options: {
          shouldCreateUser: false
        }
      })

      if (signInError) {
        throw signInError
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Link de login enviado para seu email',
        userId: existingUser.id 
      })
    }

    // Cria novo usuário
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36).slice(-12), // Senha aleatória (não será usada)
      options: {
        data: {
          name,
          cpf
        }
      }
    })

    if (signUpError) {
      throw signUpError
    }

    if (!authData.user) {
      throw new Error('Erro ao criar usuário')
    }

    // Cria registro na tabela users
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        cpf,
        name
      } as any)

    if (insertError) {
      throw insertError
    }

    // Envia magic link
    const { error: magicLinkError } = await supabase.auth.signInWithOtp({
      email
    })

    if (magicLinkError) {
      throw magicLinkError
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Conta criada! Link de login enviado para seu email',
      userId: authData.user.id 
    })

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
