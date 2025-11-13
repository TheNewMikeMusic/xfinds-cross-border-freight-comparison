'use client'

import { useRouter } from 'next/navigation'
import { SortDropdown } from '@/components/search/sort-dropdown'
import { Pagination } from '@/components/search/pagination'
import { FilterChips } from '@/components/search/filter-chips'
import { ProductCard } from '@/components/search/product-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Product, Category, Agent } from '@/lib/data'
import { useTranslations } from 'next-intl'

interface SearchResultsProps {
  products: Product[]
  categories: Category[]
  agents: Agent[]
  filters: {
    categoryId?: string
    agentId?: string
    minPrice?: number
    maxPrice?: number
  }
  sort: 'relevance' | 'price' | 'new'
  page: number
  totalPages: number
  locale: string
  searchParams: Record<string, string | undefined>
  totalCount: number
}

export function SearchResults({
  products,
  categories,
  agents,
  filters,
  sort,
  page,
  totalPages,
  locale,
  searchParams,
  totalCount,
}: SearchResultsProps) {
  const router = useRouter()
  const t = useTranslations('search')

  const updateUrl = (updates: Record<string, string | null>) => {
    const urlParams = new URLSearchParams(searchParams as any)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        urlParams.delete(key)
      } else {
        urlParams.set(key, value)
      }
    })
    router.push(`/${locale}/search?${urlParams.toString()}`)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">{t('title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">
            {t('found', { count: totalCount })}
          </p>
        </div>
        <SortDropdown
          value={sort}
          onValueChange={(value) => {
            updateUrl({ sort: value })
          }}
        />
      </div>

      <FilterChips
        filters={filters}
        categories={categories}
        agents={agents}
        onRemove={(type) => {
          if (type === 'category') updateUrl({ cat: null })
          if (type === 'agent') updateUrl({ agent: null })
          if (type === 'price') {
            updateUrl({ minPrice: null, maxPrice: null })
          }
        }}
      />

      {products.length === 0 ? (
        <EmptyState
          title={t('noResults')}
          description={t('noResultsDesc')}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-2 xl:grid-cols-3 mt-6">
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                locale={locale} 
                agents={agents}
                priority={page === 1 && index < 6} // Prioritize first 6 products on first page
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              updateUrl({ page: String(newPage) })
            }}
          />
        </>
      )}
    </>
  )
}

