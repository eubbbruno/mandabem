import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineItem {
  title: string
  description?: string
  date?: string
  icon?: LucideIcon
  status?: 'completed' | 'current' | 'upcoming'
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {items.map((item, index) => {
        const Icon = item.icon
        const isLast = index === items.length - 1
        const status = item.status || 'upcoming'

        const statusConfig = {
          completed: {
            iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
            line: 'bg-green-500',
            textColor: 'text-gray-900',
          },
          current: {
            iconBg: 'bg-gradient-to-br from-primary-500 to-accent-500',
            line: 'bg-gradient-to-b from-primary-500 to-gray-200',
            textColor: 'text-gray-900',
          },
          upcoming: {
            iconBg: 'bg-gray-200',
            line: 'bg-gray-200',
            textColor: 'text-gray-500',
          },
        }

        const config = statusConfig[status]

        return (
          <div key={index} className="relative flex gap-6">
            {/* Icon Column */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex items-center justify-center w-12 h-12 rounded-xl shadow-md z-10',
                config.iconBg
              )}>
                {Icon && <Icon className="h-6 w-6 text-white" />}
              </div>
              {!isLast && (
                <div className={cn('w-0.5 h-full mt-2', config.line)} />
              )}
            </div>

            {/* Content Column */}
            <div className="flex-1 pb-8">
              <div className="card p-6 hover:shadow-medium transition-shadow">
                <h3 className={cn('text-lg font-bold mb-1', config.textColor)}>
                  {item.title}
                </h3>
                {item.date && (
                  <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
