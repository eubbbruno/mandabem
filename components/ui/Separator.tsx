import { cn } from '@/lib/utils'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  decorative?: boolean
}

export function Separator({ 
  orientation = 'horizontal', 
  className,
  decorative = false 
}: SeparatorProps) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
    />
  )
}

export function SeparatorWithText({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex items-center py-4">
      <div className="flex-grow border-t border-gray-200" />
      <span className="flex-shrink mx-4 text-sm font-medium text-gray-500">
        {children}
      </span>
      <div className="flex-grow border-t border-gray-200" />
    </div>
  )
}
