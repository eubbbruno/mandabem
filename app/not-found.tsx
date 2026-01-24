import Link from 'next/link'
import { Button } from '@/components/Button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* 404 Number */}
          <div className="relative">
            <div className="text-[200px] font-bold leading-none gradient-text opacity-20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">🎨</div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Página não encontrada
            </h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              Ops! Parece que esta página não existe ou foi removida.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/">
              <Button size="lg">
                <Home className="h-5 w-5" />
                Voltar para Home
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                <Search className="h-5 w-5" />
                Ver Desafios
              </Button>
            </Link>
          </div>

          {/* Suggestions */}
          <div className="card p-6 bg-gradient-to-br from-gray-50 to-white">
            <h3 className="font-bold text-gray-900 mb-4">Você pode estar procurando:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                Desafios Ativos
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/meus-envios" className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                Minhas Participações
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/admin" className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
