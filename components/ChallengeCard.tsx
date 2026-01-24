import Link from 'next/link'
import { formatPrice } from '@/lib/scoring'
import { MapPin, Clock, Trophy, Sparkles, ArrowRight } from 'lucide-react'

interface ChallengeCardProps {
  id: string
  title: string
  theme: string
  prize: number
  locationName: string
  city: string
  endsAt: string
  status: 'active' | 'evaluating' | 'finished'
}

export function ChallengeCard({
  id,
  title,
  theme,
  prize,
  locationName,
  city,
  endsAt,
  status,
}: ChallengeCardProps) {
  const statusConfig = {
    active: { 
      label: '🔥 ATIVO AGORA', 
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      border: 'border-green-500',
      glow: 'shadow-neon-green'
    },
    evaluating: { 
      label: '⏳ Avaliando', 
      gradient: 'from-yellow-500 to-orange-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      glow: 'shadow-lg'
    },
    finished: { 
      label: '✅ Finalizado', 
      gradient: 'from-gray-400 to-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-400',
      glow: 'shadow-md'
    },
  }

  const config = statusConfig[status]
  const endDate = new Date(endsAt)
  const now = new Date()
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="group">
      <div className={`card-brutal bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 h-full flex flex-col transition-all hover:scale-105 ${config.glow}`}>
        {/* Status Badge ÉPICO */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm ${config.bg} border-2 ${config.border} mb-6`}>
          <span>{config.label}</span>
        </div>

        {/* Prêmio DESTAQUE */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-bold text-gray-600">PRÊMIO</span>
          </div>
          <div className={`text-5xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            {formatPrice(prize)}
          </div>
        </div>

        {/* Título e Tema */}
        <div className="flex-1 space-y-3 mb-6">
          <h3 className="text-2xl font-black text-gray-900 line-clamp-2 group-hover:text-gradient transition-all">
            {title}
          </h3>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-primary-100 to-secondary-100 border-2 border-primary-200">
            <Sparkles className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-bold text-primary-700">{theme}</span>
          </div>
        </div>

        {/* Local */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-primary-500" />
            <span className="font-bold text-sm">{locationName} • {city}</span>
          </div>
          {status === 'active' && daysLeft > 0 && (
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-sm">
                {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'} restantes
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link href={`/desafio/${id}`} className="w-full">
          <button className="w-full btn-epic text-lg py-4 flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
            <span>🎨 PARTICIPAR</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  )
}
