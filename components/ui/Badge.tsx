import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md',
        secondary: 'bg-gradient-to-r from-secondary-400 to-secondary-500 text-gray-900 shadow-md',
        accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md',
        success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md',
        warning: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-md',
        danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md',
        outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-xs',
        lg: 'px-4 py-2 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}
