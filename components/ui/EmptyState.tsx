import { LucideIcon } from 'lucide-react'
import { Button } from '../Button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-16', className)}>
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && (
        action.href ? (
          <a href={action.href}>
            <Button size="lg">{action.label}</Button>
          </a>
        ) : (
          <Button size="lg" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
