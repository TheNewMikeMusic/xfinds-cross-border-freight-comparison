import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { AgentCard } from '@/components/agents/agent-card'
import { getAgents, getFeaturedProducts, getCategoriesWithProducts } from '@/lib/data'
import { HERO_COPY } from '@/content/hero'

// To switch variants, you can use:
// Option 1: Use getHeroVariant helper
// const variant = getHeroVariant('B') // or 'A', 'C'
// <HeroSection title={variant.title} subtitle={variant.subtitle} />
//
// Option 2: Directly use HERO_COPY.variants
// const variantB = HERO_COPY.variants.find(v => v.key === 'B')
// <HeroSection title={variantB?.title} subtitle={variantB?.subtitle} />
//
// Option 3: Update HERO_COPY.title/subtitle in content/hero.ts

const HeroSection = dynamic(
  () => import('@/components/home/hero-section').then((mod) => mod.HeroSection),
  { ssr: false }
)

const CategoryGrid = dynamic(
  () => import('@/components/home/category-grid').then((mod) => mod.CategoryGrid),
  { ssr: false }
)

const ProductCarousel = dynamic(
  () => import('@/components/home/product-carousel').then((mod) => mod.ProductCarousel),
  { ssr: false }
)

interface LandingPageProps {
  params: Promise<{ locale: string }>
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const agents = getAgents()
  // Get more products for pagination (18 products = 3 pages of 6)
  const featuredProducts = getFeaturedProducts(18)
  // Get categories with product counts and sample products
  const categoriesWithProducts = getCategoriesWithProducts()

  // Show all 6 agents
  const featuredAgents = agents

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero section uses HERO_COPY from content/hero.ts
            Background: If /public/hero/xfinds-hero-default.jpg exists, it will be used;
            otherwise, CSS gradient fallback will be applied automatically */}
        <HeroSection title={HERO_COPY.title} subtitle={HERO_COPY.subtitle} />

        {/* Categories Section */}
        {categoriesWithProducts.length > 0 && (
          <section className="py-8 px-4 sm:py-12 md:py-16">
            <div className="container mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">{t('categories')}</h2>
              <CategoryGrid categories={categoriesWithProducts} locale={locale} />
            </div>
          </section>
        )}

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="py-8 px-4 sm:py-12 md:py-16">
            <div className="container mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">{t('featuredProducts')}</h2>
              <ProductCarousel 
                products={featuredProducts} 
                locale={locale} 
                agents={agents}
                itemsPerPage={6}
              />
            </div>
          </section>
        )}

        {/* Featured Agents Section */}
        <section className="py-8 px-4 sm:py-12 md:py-16 bg-gray-900/50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold">{t('featuredAgents')}</h2>
              <a
                href={`/${locale}/agents`}
                className="text-blue-400 hover:text-blue-300 text-sm sm:text-base font-medium transition-colors"
              >
                {locale === 'zh' ? '更多' : 'More'} →
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6 items-stretch">
              {featuredAgents.map((agent, index) => (
                <div key={agent.id} className={`${index >= 4 ? 'hidden md:block' : ''} h-full`}>
                  <AgentCard agent={agent} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
