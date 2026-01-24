import { Check, Sparkles } from 'lucide-react'
import { Button } from '../Button'
import { cn } from '@/lib/utils'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCardProps {
  title: string
  price: string
  period?: string
  description?: string
  features: PricingFeature[]
  highlighted?: boolean
  ctaText?: string
  onCtaClick?: () => void
  badge?: string
  className?: string
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  highlighted = false,
  ctaText = 'Começar',
  onCtaClick,
  badge,
  className
}: PricingCardProps) {
  return (
    <div className={cn(
      'card p-8 relative',
      highlighted && 'border-2 border-primary-500 shadow-strong scale-105',
      className
    )}>
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {/* Price */}
      <div className="text-center mb-8">
        <div className="text-5xl font-bold gradient-text mb-2">
          {price}
        </div>
        {period && (
          <p className="text-sm text-gray-500">{period}</p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={cn(
              'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
              feature.included 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
            )}>
              <Check className="h-3.5 w-3.5" />
            </div>
            <span className={cn(
              'text-sm',
              feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
            )}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button 
        onClick={onCtaClick}
        variant={highlighted ? 'primary' : 'outline'}
        size="lg"
        fullWidth
      >
        {ctaText}
      </Button>
    </div>
  )
}
