import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { FiltersPanel } from '@/components/search/filters-panel'
import { SearchResults } from '@/components/search/search-results'
import { readProducts, readCategories, getAgents } from '@/lib/data'
import { searchProducts } from '@/lib/fuse'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCardSkeleton } from '@/components/search/product-card'

const ITEMS_PER_PAGE = 12

interface SearchPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q?: string
    cat?: string
    agent?: string
    minPrice?: string
    maxPrice?: string
    sort?: 'relevance' | 'price' | 'new'
    page?: string
  }>
}

async function SearchContent({ params, searchParams }: SearchPageProps) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('search')
  const products = readProducts()
  const categories = readCategories()
  const agents = getAgents()

  const page = Number(resolvedSearchParams.page) || 1
  const sort = resolvedSearchParams.sort || 'relevance'

  const filteredProducts = searchProducts(products, {
    query: resolvedSearchParams.q,
    categoryId: resolvedSearchParams.cat,
    agentId: resolvedSearchParams.agent,
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
    sort,
  })

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  const filters = {
    categoryId: resolvedSearchParams.cat,
    agentId: resolvedSearchParams.agent,
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-2 py-6 sm:px-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <FiltersPanel
              categories={categories}
              agents={agents}
            />
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-4">
              <FiltersPanel
                categories={categories}
                agents={agents}
                mobile
              />
            </div>
            <SearchResults
              products={paginatedProducts}
              categories={categories}
              agents={agents}
              filters={filters}
              sort={sort}
              page={page}
              totalPages={totalPages}
              locale={locale}
              searchParams={resolvedSearchParams}
              totalCount={filteredProducts.length}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-2 py-6 sm:px-4 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              <aside className="hidden lg:block lg:col-span-1">
                <Skeleton className="h-96 w-full" />
              </aside>
              <div className="lg:col-span-3">
                <div className="lg:hidden mb-4">
                  <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-12 w-full mb-6" />
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchContent {...props} />
    </Suspense>
  )
}
