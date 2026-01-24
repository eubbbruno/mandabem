import Link from 'next/link'
import { formatPrice } from '@/lib/scoring'
import { MapPin, Clock, Trophy } from 'lucide-react'

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
    active: { label: 'Ativo', color: 'bg-green-50 text-green-700 border-green-200' },
    evaluating: { label: 'Em avaliação', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    finished: { label: 'Finalizado', color: 'bg-neutral-100 text-neutral-700 border-neutral-200' },
  }

  const config = statusConfig[status]
  const endDate = new Date(endsAt)
  const now = new Date()
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Link href={`/desafio/${id}`}>
      <div className="card card-hover p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`badge ${config.color}`}>
            {config.label}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-neutral-900">{formatPrice(prize)}</div>
            <div className="text-xs text-neutral-500">Prêmio</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3 mb-4">
          <h3 className="text-lg font-bold text-neutral-900 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-neutral-600">
            {theme}
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-3 pt-4 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{locationName} • {city}</span>
          </div>
          {status === 'active' && daysLeft > 0 && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="h-4 w-4" />
              <span>{daysLeft} {daysLeft === 1 ? 'dia' : 'dias'} restantes</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
