import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
        className
      )}
      style={{
        animation: 'shimmer 2s infinite',
      }}
      {...props}
    />
  )
}

export function ChallengeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-20" />
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center justify-between pt-4 border-t">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}
