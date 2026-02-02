'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Sparkles, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AuthModal from './AuthModal'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Verifica se tem usuário logado
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleScroll = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navigation = [
    { name: '🎨 Desafios', action: () => handleScroll('desafios'), type: 'scroll' },
    { name: '💡 Como Funciona', action: () => handleScroll('como-funciona'), type: 'scroll' },
    { name: '📊 Minhas Participações', href: '/meus-envios', type: 'link' },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b-4 border-black shadow-brutal">
        <nav className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo ÉPICO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 p-3 rounded-xl shadow-brutal-sm">
                  <Sparkles className="h-6 w-6 text-white animate-spin-slow" />
                </div>
              </div>
              <div className="text-3xl font-black text-gradient">
                MandaBem
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                item.type === 'scroll' ? (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="relative px-4 py-2 text-base font-bold text-gray-900 hover:text-primary-500 transition-all group"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 transform" />
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className="relative px-4 py-2 text-base font-bold text-gray-900 hover:text-primary-500 transition-all group"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 transform" />
                  </Link>
                )
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-primary-300">
                    <User className="h-5 w-5 text-primary-600" />
                    <span className="font-bold text-gray-900 text-sm">
                      {user.user_metadata?.name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all hover:scale-105"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="btn-epic text-base px-8 py-3"
                >
                  🔐 Entrar / Cadastrar
                </button>
              )}
            </div>

            {/* Mobile menu button BRUTAL */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden card-brutal p-3 bg-gradient-to-br from-primary-500 to-secondary-500 hover:scale-110 transition-transform"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation ÉPICO */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-4 border-black bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
            <div className="container py-6 space-y-3">
              {navigation.map((item) => (
                item.type === 'scroll' ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.action!()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left card-brutal px-6 py-4 text-base font-bold text-gray-900 bg-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className="block card-brutal px-6 py-4 text-base font-bold text-gray-900 bg-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-4 space-y-3">
                {user ? (
                  <>
                    <div className="card-brutal px-6 py-4 bg-white text-center">
                      <User className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                      <span className="font-bold text-gray-900">
                        {user.user_metadata?.name || user.email}
                      </span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-red-500 text-white font-bold"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sair</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setShowAuthModal(true)
                      setMobileMenuOpen(false)
                    }}
                    className="btn-epic w-full text-lg py-4"
                  >
                    🔐 Entrar / Cadastrar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
