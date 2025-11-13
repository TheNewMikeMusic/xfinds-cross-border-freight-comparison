'use client'

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4 text-6xl">⚠️</div>
      <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">{title}</h3>
      {description && <p className="text-muted-foreground dark:text-gray-400 mb-6 max-w-md">{description}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
