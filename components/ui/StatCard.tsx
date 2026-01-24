import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  gradient: string
  bgGradient: string
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ 
  label, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient, 
  bgGradient,
  trend,
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      'card p-6 bg-gradient-to-br border-2 border-gray-200 hover:shadow-medium transition-all',
      bgGradient,
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'flex items-center justify-center w-12 h-12 rounded-xl shadow-md bg-gradient-to-br',
          gradient
        )}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className={cn(
            'px-2 py-1 rounded-lg text-xs font-bold',
            trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          )}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
  )
}
