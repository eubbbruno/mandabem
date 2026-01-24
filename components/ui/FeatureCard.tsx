'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient?: string
  index?: number
  className?: string
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient = 'from-primary-500 to-primary-600',
  index = 0,
  className 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn('group relative', className)}
    >
      <div className="card card-hover p-8 text-center h-full">
        {/* Icon with Glow */}
        <div className="relative inline-flex mb-6">
          <div className={cn(
            'absolute inset-0 bg-gradient-to-r opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity',
            gradient
          )} />
          <div className={cn(
            'relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r shadow-md group-hover:scale-110 transition-transform',
            gradient
          )}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

interface IconFeatureProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function IconFeature({ icon: Icon, title, description, className }: IconFeatureProps) {
  return (
    <div className={cn('flex items-start gap-4', className)}>
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100">
        <Icon className="h-5 w-5 text-primary-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
