import { cn } from '@/lib/utils'

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
}

export function Grid({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
  className,
  ...props 
}: GridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }

  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    12: 'gap-12',
  }

  const colClasses = [
    cols.default && gridCols[cols.default as keyof typeof gridCols],
    cols.sm && `sm:${gridCols[cols.sm as keyof typeof gridCols]}`,
    cols.md && `md:${gridCols[cols.md as keyof typeof gridCols]}`,
    cols.lg && `lg:${gridCols[cols.lg as keyof typeof gridCols]}`,
    cols.xl && `xl:${gridCols[cols.xl as keyof typeof gridCols]}`,
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={cn(
        'grid',
        colClasses,
        gapClasses[gap as keyof typeof gapClasses],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  gap?: number
  wrap?: boolean
}

export function Flex({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 4,
  wrap = false,
  className,
  ...props
}: FlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }

  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        gapClasses[gap as keyof typeof gapClasses],
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
