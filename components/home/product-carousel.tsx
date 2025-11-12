'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/search/product-card'
import { Product, Agent } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

interface ProductCarouselProps {
  products: Product[]
  locale: string
  agents: Agent[]
  itemsPerPage?: number
}

export function ProductCarousel({ products, locale, agents, itemsPerPage = 6 }: ProductCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  
  const totalPages = Math.ceil(products.length / itemsPerPage)
  
  // Get products for current page
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const goToPrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  // Auto-play disabled by default
  // Uncomment the code below to enable auto-play
  // useEffect(() => {
  //   if (totalPages <= 1) return
  //   const timer = setInterval(() => {
  //     goToNext()
  //   }, 5000)
  //   return () => clearInterval(timer)
  // }, [totalPages])

  if (products.length === 0) return null

  return (
    <div className="relative">
      <div className="relative overflow-visible">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 100 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {currentProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                locale={locale} 
                agents={agents}
                priority={index < 3} // Prioritize first 3 products on first page
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <>
          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="glass border-blue-600/30 bg-gray-800/50 backdrop-blur-xl hover:bg-gray-700/50 touch-manipulation h-10 w-10 sm:h-12 sm:w-12"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Page Indicators */}
            <div className="flex gap-1.5 sm:gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-2 rounded-full transition-all duration-300 touch-manipulation min-w-[8px] ${
                    index === currentPage
                      ? 'w-6 sm:w-8 bg-blue-500'
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="glass border-blue-600/30 bg-gray-800/50 backdrop-blur-xl hover:bg-gray-700/50 touch-manipulation h-10 w-10 sm:h-12 sm:w-12"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

