import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-xl border-2 p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:pl-8',
  {
    variants: {
      variant: {
        default: 'bg-gray-50 border-gray-200 text-gray-900 [&>svg]:text-gray-600',
        success: 'bg-green-50 border-green-200 text-green-900 [&>svg]:text-green-600',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 [&>svg]:text-yellow-600',
        error: 'bg-red-50 border-red-200 text-red-900 [&>svg]:text-red-600',
        info: 'bg-blue-50 border-blue-200 text-blue-900 [&>svg]:text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const iconMap = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  icon?: React.ReactNode
}

export function Alert({ 
  className, 
  variant = 'default', 
  title,
  icon,
  children,
  ...props 
}: AlertProps) {
  const Icon = iconMap[variant || 'default']

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon || <Icon className="h-5 w-5" />}
      <div className="space-y-1">
        {title && (
          <h5 className="font-bold text-sm leading-none tracking-tight">
            {title}
          </h5>
        )}
        <div className="text-sm [&_p]:leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
