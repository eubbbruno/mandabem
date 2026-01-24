'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  onChange?: (value: number) => void
  className?: string
}

export function Rating({ 
  value, 
  max = 10, 
  size = 'md',
  readonly = false,
  onChange,
  className 
}: RatingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const stars = Array.from({ length: max }, (_, i) => i + 1)
  const percentage = (value / max) * 100

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stars.map((star) => {
        const isFilled = star <= value
        const isPartial = star === Math.ceil(value) && value % 1 !== 0
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange?.(star)}
            disabled={readonly}
            className={cn(
              'transition-all',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default'
            )}
          >
            <Star 
              className={cn(
                sizes[size],
                isFilled || isPartial 
                  ? 'fill-primary-500 text-primary-500' 
                  : 'text-gray-300'
              )}
            />
          </button>
        )
      })}
      <span className="ml-2 text-sm font-semibold text-gray-700">
        {value.toFixed(1)}/{max}
      </span>
    </div>
  )
}

interface ScoreBarProps {
  label: string
  value: number
  max?: number
  color?: string
  className?: string
}

export function ScoreBar({ 
  label, 
  value, 
  max = 10, 
  color = 'from-primary-500 to-accent-500',
  className 
}: ScoreBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}/{max}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn('h-full bg-gradient-to-r rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
