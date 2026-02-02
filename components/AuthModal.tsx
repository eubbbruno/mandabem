'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cpf, setCpf] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const supabase = createClientComponentClient()

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'register') {
        // 1. Criar conta
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              cpf: cpf.replace(/\D/g, '')
            }
          }
        })
        if (authError) throw authError

        // 2. Criar perfil
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({ 
              id: authData.user.id, 
              email, 
              cpf: cpf.replace(/\D/g, ''), 
              name 
            })
          if (profileError) {
            console.error('Profile error:', profileError)
            // Não falha se o perfil já existe
          }
        }
        
        setSuccess('✅ Conta criada! Verifique seu email para confirmar.')
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 2000)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        
        setSuccess('✅ Login realizado com sucesso!')
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 1000)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl p-8 max-w-md w-full border-4 border-primary-500 shadow-neon relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce-slow">
            {mode === 'login' ? '👋' : '🚀'}
          </div>
          <h2 className="text-4xl font-black text-gradient-fire mb-2">
            {mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </h2>
          <p className="text-gray-300 font-bold">
            {mode === 'login' 
              ? 'Acesse sua conta para participar dos desafios' 
              : 'Crie sua conta em 30 segundos'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500 text-red-300 px-4 py-3 rounded-xl mb-4 font-bold">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border-2 border-green-500 text-green-300 px-4 py-3 rounded-xl mb-4 font-bold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-black text-gray-300 mb-2">
                  📝 Seu nome (como quer ser chamado)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:border-primary-500 outline-none text-white font-bold placeholder:text-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-300 mb-2">
                  🆔 CPF (só números, a gente formata)
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:border-primary-500 outline-none text-white font-bold placeholder:text-gray-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  💡 Usamos o CPF pra controlar quantas vezes você participa (e calcular o preço certinho)
                </p>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-black text-gray-300 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:border-primary-500 outline-none text-white font-bold placeholder:text-gray-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-black text-gray-300 mb-2">
              🔒 Senha {mode === 'register' && '(mínimo 6 caracteres)'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:border-primary-500 outline-none text-white font-bold placeholder:text-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-black rounded-xl text-lg hover:scale-105 transition-all disabled:opacity-50 shadow-neon"
          >
            {loading ? '⏳ Aguarde...' : mode === 'login' ? '🚀 Entrar' : '✅ Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
              setSuccess('')
            }}
            className="text-primary-400 hover:text-primary-300 font-bold hover:underline"
          >
            {mode === 'login' 
              ? '✨ Não tem conta? Criar agora (é grátis!)' 
              : '🔑 Já tem conta? Fazer login'}
          </button>
        </div>
      </div>
    </div>
  )
}
