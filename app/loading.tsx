import { Loader2, Sparkles } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-strong">
            <Sparkles className="h-10 w-10 text-white animate-spin-slow" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Carregando...</h2>
          <p className="text-gray-600">Preparando conteúdo incrível para você</p>
        </div>
      </div>
    </div>
  )
}
