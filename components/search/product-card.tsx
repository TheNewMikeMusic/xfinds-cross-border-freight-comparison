'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Product, Agent } from '@/lib/data'
import { PriceDisplay } from '@/components/shared/price-display'
import { motion, useReducedMotion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

interface ProductCardProps {
  product: Product
  locale?: string
  agents?: Agent[]
  priority?: boolean // For above-the-fold images
}

const BLUR_DATA_URL =
  "data:image/svg+xml,%3Csvg%20width%3D'400'%20height%3D'400'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient%20id%3D'grad'%20x1%3D'0%25'%20x2%3D'100%25'%20y1%3D'0%25'%20y2%3D'100%25'%3E%3Cstop%20offset%3D'0%25'%20stop-color%3D'%230b1220'/%3E%3Cstop%20offset%3D'60%25'%20stop-color%3D'%2320345c'/%3E%3Cstop%20offset%3D'100%25'%20stop-color%3D'%233b82f6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20fill%3D'url(%23grad)'%20width%3D'400'%20height%3D'400'/%3E%3C/svg%3E"

export function ProductCard({ product, locale, agents = [], priority = false }: ProductCardProps) {
  const params = useParams()
  const currentLocale = locale || (params?.locale as string) || 'en'
  const t = useTranslations('search')
  const minPrice = product.priceGuide.min
  const currency = product.priceGuide.currency
  const shouldReduceMotion = useReducedMotion()
  const isDeal = product.tags.some((tag) => /sale|deal|特价|限时/i.test(tag))
  const [imageError, setImageError] = useState(false)

  // Find the lowest price offer and its agent
  const bestOffer = useMemo(() => {
    if (product.offers.length === 0) return null
    return product.offers.reduce((best, offer) => {
      const bestTotal = best.price + best.shipFee
      const offerTotal = offer.price + offer.shipFee
      return offerTotal < bestTotal ? offer : best
    })
  }, [product.offers])

  const bestAgent = useMemo(() => {
    if (!bestOffer || agents.length === 0) return null
    return agents.find((a) => a.id === bestOffer.agentId) || null
  }, [bestOffer, agents])

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.2 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.45, ease: 'easeOut' }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -8,
              scale: 1.01,
              transition: { duration: 0.35, ease: 'easeOut' },
            }
      }
      className="pt-2 sm:pt-0"
    >
      <Link href={`/${currentLocale}/product/${product.slug}`} className="group block rounded-3xl focus-ring touch-manipulation active:scale-[0.98]">
        <Card className="glass-card overflow-hidden rounded-3xl border-blue-600/20 p-0 focus-ring">
          <div className="relative aspect-square overflow-hidden rounded-[1.8rem] bg-gray-800">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {product.cover && !imageError ? (
              <Image
                src={product.cover}
                alt={product.title}
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                priority={priority}
                loading={priority ? undefined : 'lazy'}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-gray-500 text-sm">{t('noImage')}</span>
              </div>
            )}
          </div>
          <CardContent className="p-3 sm:p-6">
            <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-blue-200 sm:text-lg">
              {product.title}
            </h3>
            <p className="mb-2 text-xs text-gray-400 sm:text-sm">{product.brand}</p>
            <div className="flex items-center justify-between mb-2">
              <div className={cn('text-blue-300 text-base sm:text-xl', isDeal && 'animate-[priceFlash_1.8s_ease-in-out_infinite]')}>
                <PriceDisplay amount={minPrice} originalCurrency={currency as any} size="lg" />
              </div>
              <span className="text-xs text-gray-500">
                {t('offers', { count: product.offers.length })}
              </span>
            </div>
            {bestAgent && bestOffer && (
              <div className="flex items-center gap-1.5 mb-2 p-1.5 sm:p-2 rounded-lg bg-gray-800/50 border border-blue-600/20">
                {bestAgent.logo && (
                  <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={bestAgent.logo}
                      alt={bestAgent.name}
                      fill
                      className="object-contain p-0.5"
                      sizes="20px"
                    />
                  </div>
                )}
                <span className="text-xs text-gray-400 flex-1 truncate">
                  {t('bestFrom', { agent: bestAgent.name })}
                </span>
                {bestOffer.link && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      try {
                        const newWindow = window.open(bestOffer.link, '_blank', 'noopener,noreferrer')
                        if (!newWindow) {
                          console.warn('Popup blocked. Please allow popups for this site.')
                        }
                      } catch (error) {
                        console.error('Failed to open link:', error)
                      }
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    title={t('viewOnAgent', { agent: bestAgent.name })}
                    aria-label={t('viewOnAgent', { agent: bestAgent.name })}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
            {product.tags.length > 0 && (
              <div className="hidden sm:flex mt-2 flex-wrap gap-1.5">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-blue-500/30 px-2 py-0.5 text-xs text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card space-y-4">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}
