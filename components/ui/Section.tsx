'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  animate?: boolean
  delay?: number
}

export function Section({ 
  children, 
  animate = true,
  delay = 0,
  className,
  ...props 
}: SectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (!animate) {
    return (
      <section className={className} {...props}>
        {children}
      </section>
    )
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function SectionHeader({ 
  title, 
  subtitle, 
  badge,
  align = 'center',
  className 
}: SectionHeaderProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={cn('space-y-4 mb-12', alignClasses[align], className)}>
      {badge && (
        <div className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-semibold',
          align === 'center' && 'mx-auto'
        )}>
          {badge}
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
