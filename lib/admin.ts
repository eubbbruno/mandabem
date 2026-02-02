import { createClient } from '@/lib/supabase/server'

// COLOQUE SEU EMAIL AQUI PARA SER ADMIN
const ADMIN_EMAILS = [
  'seu@email.com', // Substitua pelo seu email
  'admin@mandabem.com',
]

export async function isAdmin(userId?: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    
    // Se não passou userId, pega do usuário logado
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false
      userId = user.id
    }

    // Busca o email do usuário
    const { data: profile }: { data: any } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single()

    if (!profile?.email) return false

    // Verifica se o email está na lista de admins
    return ADMIN_EMAILS.includes(profile.email.toLowerCase())
  } catch (error) {
    console.error('Error checking admin:', error)
    return false
  }
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Acesso negado. Apenas administradores.')
  }
  return true
}
