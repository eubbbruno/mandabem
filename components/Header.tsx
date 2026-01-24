'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: '🎨 Desafios', href: '/#desafios' },
    { name: '💡 Como Funciona', href: '/#como-funciona' },
    { name: '📊 Minhas Participações', href: '/meus-envios' },
  ]

  return (
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
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-base font-bold text-gray-900 hover:text-primary-500 transition-all group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 transform" />
              </Link>
            ))}
          </div>

          {/* CTA Button ÉPICO */}
          <div className="hidden md:block">
            <Link href="/#desafios">
              <button className="btn-epic text-base px-8 py-3">
                🚀 Participar Agora
              </button>
            </Link>
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
              <Link
                key={item.name}
                href={item.href}
                className="block card-brutal px-6 py-4 text-base font-bold text-gray-900 bg-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500 hover:text-white transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/#desafios">
                <button className="btn-epic w-full text-lg py-4">
                  🚀 Participar Agora
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
