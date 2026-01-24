import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ 
  src, 
  alt = 'Avatar', 
  fallback,
  size = 'md',
  className 
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }

  const getInitials = (name?: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn(
      'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500 text-white font-bold shadow-md',
      sizes[size],
      className
    )}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : fallback ? (
        <span>{getInitials(fallback)}</span>
      ) : (
        <User className="h-1/2 w-1/2" />
      )}
    </div>
  )
}
