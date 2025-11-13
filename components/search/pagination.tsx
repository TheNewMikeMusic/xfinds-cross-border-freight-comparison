'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations('pagination')
  if (totalPages <= 1) return null

  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:bg-gray-800/50 backdrop-blur-xl"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">{t('previous')}</span>
      </Button>

      {start > 1 && (
        <>
          <Button
            variant="outline"
            onClick={() => onPageChange(1)}
            className="glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:bg-gray-800/50 backdrop-blur-xl"
          >
            1
          </Button>
          {start > 2 && <span className="text-muted-foreground dark:text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          onClick={() => onPageChange(page)}
          className={
            page === currentPage
              ? 'bg-blue-600 hover:bg-blue-500'
              : 'glass border-blue-600/30 bg-gray-800/50 backdrop-blur-xl'
          }
        >
          {page}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-muted-foreground dark:text-gray-400">...</span>}
          <Button
            variant="outline"
            onClick={() => onPageChange(totalPages)}
            className="glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:bg-gray-800/50 backdrop-blur-xl"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:bg-gray-800/50 backdrop-blur-xl"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">{t('next')}</span>
      </Button>
    </div>
  )
}
