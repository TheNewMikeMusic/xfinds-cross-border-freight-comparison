import { Shimmer } from '@/components/shared/shimmer'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 text-6xl">🔍</div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      {description && <p className="text-muted-foreground dark:text-gray-400 mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

