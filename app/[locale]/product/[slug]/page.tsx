import { setRequestLocale } from 'next-intl/server'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { MediaGallery } from '@/components/product/media-gallery'
import { Specs } from '@/components/product/specs'
import {
  getProductBySlug,
  getAgents,
  readCategories,
} from '@/lib/data'
import { notFound } from 'next/navigation'
import { ProductSummary } from '@/components/product/product-summary'

interface ProductPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const product = getProductBySlug(slug)
  const agents = getAgents()
  const categories = readCategories()

  if (!product) {
    notFound()
  }

  const category = categories.find((c) => c.id === product.categoryId)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-3 py-6 sm:px-4 sm:py-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start">
          <div className="lg:sticky lg:top-8">
            <MediaGallery cover={product.cover} gallery={product.gallery} title={product.title} />
          </div>
          <div className="space-y-4">
            <ProductSummary product={product} category={category} locale={locale} agents={agents} />
            <Specs specs={product.specs} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

