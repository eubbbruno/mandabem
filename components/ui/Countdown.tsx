'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CountdownProps {
  targetDate: string | Date
  onComplete?: () => void
  className?: string
}

export function Countdown({ targetDate, onComplete, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setIsExpired(true)
        onComplete?.()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (isExpired) {
    return (
      <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700', className)}>
        <Clock className="h-4 w-4" />
        <span className="font-semibold text-sm">Encerrado</span>
      </div>
    )
  }

  const timeUnits = [
    { label: 'dias', value: timeLeft.days },
    { label: 'horas', value: timeLeft.hours },
    { label: 'min', value: timeLeft.minutes },
    { label: 'seg', value: timeLeft.seconds },
  ]

  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <Clock className="h-5 w-5 text-primary-500" />
      <div className="flex items-center gap-2">
        {timeUnits.map((unit, index) => (
          <div key={unit.label}>
            {index > 0 && <span className="text-gray-400 mx-1">:</span>}
            <div className="inline-flex flex-col items-center">
              <span className="text-2xl font-bold text-gray-900 tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CountdownCompact({ targetDate, className }: { targetDate: string | Date, className?: string }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`)
        } else {
          setTimeLeft(`${minutes}m`)
        }
      } else {
        setTimeLeft('Encerrado')
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium text-gray-600', className)}>
      <Clock className="h-4 w-4" />
      {timeLeft}
    </span>
  )
}
