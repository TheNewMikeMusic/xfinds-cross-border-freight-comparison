'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <h1 className="text-4xl font-bold mb-4 text-red-400">An Error Occurred</h1>
          <p className="text-gray-400 mb-8 max-w-md text-center">
            {error.message || 'An unexpected error occurred. Please refresh the page and try again.'}
          </p>
          <button
            onClick={reset}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  )
}
