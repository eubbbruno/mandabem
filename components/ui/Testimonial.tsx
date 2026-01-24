import { Quote, Star } from 'lucide-react'
import { Avatar } from './Avatar'
import { cn } from '@/lib/utils'

interface TestimonialProps {
  quote: string
  author: {
    name: string
    role?: string
    avatar?: string
  }
  rating?: number
  className?: string
}

export function Testimonial({ quote, author, rating, className }: TestimonialProps) {
  return (
    <div className={cn('card p-8 bg-gradient-to-br from-white to-gray-50 hover:shadow-medium transition-shadow', className)}>
      {/* Quote Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 mb-6">
        <Quote className="h-6 w-6 text-primary-600" />
      </div>

      {/* Rating */}
      {rating && (
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i}
              className={cn(
                'h-4 w-4',
                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              )}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-gray-700 leading-relaxed mb-6">
        "{quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
        <Avatar src={author.avatar} fallback={author.name} size="md" />
        <div>
          <div className="font-bold text-gray-900">{author.name}</div>
          {author.role && (
            <div className="text-sm text-gray-500">{author.role}</div>
          )}
        </div>
      </div>
    </div>
  )
}
