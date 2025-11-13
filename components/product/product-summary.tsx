'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Product, Category, Agent, ProductOffer } from '@/lib/data'
import { PriceDisplay } from '@/components/shared/price-display'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, CheckCircle, XCircle, ChevronDown, ChevronUp, ExternalLink, Check, Plus } from 'lucide-react'
import { RedirectDisclaimer, hasSeenRedirectDisclaimer } from '@/components/shared/redirect-disclaimer'
import { useCartStore } from '@/store/cart-store'
import { rankOffers } from '@/lib/ranking'
import { getAgentTrackingUrl } from '@/lib/agent-utils'
import { RecommendRibbon } from '@/components/shared/recommend-ribbon'
import { ShippingDetailDialog } from '@/components/shared/shipping-detail-dialog'
import { SKUSelector, SelectedSKU } from '@/components/product/sku-selector'
import Image from 'next/image'

interface ProductSummaryProps {
  product: Product
  category?: Category
  locale: string
  agents?: Agent[]
}

export function ProductSummary({ product, category, locale, agents = [] }: ProductSummaryProps) {
  const t = useTranslations('product')
  const shouldReduceMotion = useReducedMotion()
  const addToCart = useCartStore((state) => state.addItem)
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false)
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null)
  const [isComparisonExpanded, setIsComparisonExpanded] = useState(false)
  const [shippingDetailOpen, setShippingDetailOpen] = useState(false)
  const [selectedShippingOffer, setSelectedShippingOffer] = useState<ProductOffer | null>(null)
  const [selectedSKU, setSelectedSKU] = useState<SelectedSKU>({})

  // Rank offers
  const rankedOffers = useMemo(() => {
    if (product.offers.length === 0) return []
    return rankOffers(product.offers, agents)
  }, [product.offers, agents])

  // Initialize selectedAgentId with first offer (consistent for SSR and client)
  const defaultAgentId = rankedOffers.length > 0 ? rankedOffers[0].agentId : null
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(defaultAgentId)

  // Get selected offer - ensure consistent server/client rendering
  const selectedOffer = useMemo(() => {
    if (rankedOffers.length === 0) return null
    const defaultOffer = rankedOffers[0]
    const agentIdToUse = selectedAgentId || defaultAgentId
    return rankedOffers.find((o) => o.agentId === agentIdToUse) || defaultOffer
  }, [rankedOffers, selectedAgentId, defaultAgentId])
  
  const selectedAgent = useMemo(() => {
    if (!selectedOffer) return null
    return agents.find((a) => a.id === selectedOffer.agentId) || null
  }, [selectedOffer, agents])

  // Calculate statistics
  const inStockCount = rankedOffers.filter(o => o.inStock).length
  const recommendedCount = rankedOffers.filter(o => {
    const agent = agents.find(a => a.id === o.agentId)
    return agent?.recommended
  }).length

  const total = selectedOffer ? selectedOffer.price + selectedOffer.shipFee : 0
  const trackingUrl = selectedAgent && selectedOffer
    ? getAgentTrackingUrl(selectedAgent, selectedOffer.link)
    : selectedOffer?.link || ''

  // Handle redirect with disclaimer
  const handleRedirect = (url: string) => {
    if (hasSeenRedirectDisclaimer()) {
      try {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (!newWindow) {
          console.warn('Popup blocked. Please allow popups for this site.')
        }
      } catch (error) {
        console.error('Failed to open link:', error)
      }
    } else {
      setPendingRedirectUrl(url)
      setRedirectDialogOpen(true)
    }
  }

  const handleRedirectContinue = () => {
    if (pendingRedirectUrl) {
      try {
        const newWindow = window.open(pendingRedirectUrl, '_blank', 'noopener,noreferrer')
        if (!newWindow) {
          console.warn('Popup blocked. Please allow popups for this site.')
        }
      } catch (error) {
        console.error('Failed to open link:', error)
      }
    }
    setRedirectDialogOpen(false)
    setPendingRedirectUrl(null)
  }

  const handleRedirectCancel = () => {
    setRedirectDialogOpen(false)
    setPendingRedirectUrl(null)
  }

  // Handle add to list
  const handleAddToList = () => {
    if (!selectedOffer) return
    
    // Check if SKU options are required and all selected
    if (product.skuOptions && product.skuOptions.length > 0) {
      const allSelected = product.skuOptions.every((option) => selectedSKU[option.name])
      if (!allSelected) {
        return
      }
    }
    
    addToCart({
      productId: product.id,
      offerId: `${product.id}-${selectedOffer.agentId}-${JSON.stringify(selectedSKU)}`,
      agentId: selectedOffer.agentId,
      price: selectedOffer.price,
      shipFee: selectedOffer.shipFee,
      link: selectedOffer.link,
      sku: Object.keys(selectedSKU).length > 0 ? selectedSKU : undefined,
    })
  }

  return (
    <motion.section
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="glass relative overflow-hidden rounded-3xl border-white/10 dark:border-white/10 border-gray-200/50 bg-white/95 dark:bg-gradient-to-br dark:from-[rgba(8,13,28,0.95)] dark:via-[rgba(7,11,24,0.9)] dark:to-[rgba(4,6,12,0.95)] p-4 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 rounded-3xl"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(125,211,252,0.35), transparent 50%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.25), transparent 55%)',
        }}
      />
      <div className="relative space-y-4">
        {category && (
          <Link
            href={`/${locale}/search?cat=${category.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 dark:border-white/15 border-blue-500/30 bg-blue-50 dark:bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-cyan-100 transition-colors hover:border-blue-600/50 dark:hover:border-white/40"
          >
            {category.name}
          </Link>
        )}

        <div>
          <motion.h1
            className="mb-2 text-xl font-semibold text-foreground dark:text-white sm:text-2xl md:text-3xl line-clamp-2 leading-tight"
            initial={shouldReduceMotion ? undefined : { y: 20, opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.4, ease: 'easeOut' }}
            title={product.title}
          >
            {product.title}
          </motion.h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground dark:text-gray-400 mb-4">{product.brand}</p>
          {product.description && (
            <motion.p
              className="text-sm sm:text-base text-foreground/80 dark:text-gray-300 leading-relaxed mb-6"
              initial={shouldReduceMotion ? undefined : { y: 20, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              {product.description}
            </motion.p>
          )}
        </div>

        {/* Agent Offers Section */}
        {product.offers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 dark:border-white/10 border-gray-200/50 bg-gray-50 dark:bg-white/5 p-8 text-center">
            <p className="text-muted-foreground dark:text-gray-400">{t('noAgentsAvailable')}</p>
            <p className="text-sm text-muted-foreground/80 dark:text-gray-500 mt-2">{t('noAgentsDesc')}</p>
          </div>
        ) : (
        <div className="space-y-4 overflow-visible">
            {/* Header with stats */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">{t('offers')}</h2>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                  <span>{t('offerCount', { count: rankedOffers.length })}</span>
                  {inStockCount > 0 && (
                    <>
                      <span className="text-muted-foreground/50 dark:text-gray-600">•</span>
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        {inStockCount} {t('inStock')}
                      </span>
                    </>
                  )}
                  {recommendedCount > 0 && (
                    <>
                      <span className="text-muted-foreground/50 dark:text-gray-600">•</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{recommendedCount} {t('recommended')}</span>
                    </>
                  )}
              </div>
            </div>
          </div>

            {/* Selected Agent Card */}
            {selectedOffer && selectedAgent && (
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 dark:border-white/10 border-gray-200/50 bg-blue-50/50 dark:bg-transparent p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 relative overflow-visible"
                style={{ '--panel': 'transparent', background: 'transparent', backdropFilter: 'none' } as React.CSSProperties & { '--panel': string }}
              >
                {selectedAgent.recommended && (
                  <div className="absolute -top-2 -right-2 z-30 overflow-visible">
                    <RecommendRibbon />
                  </div>
                )}
                
                {/* Agent Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                    {selectedAgent.logo && (
                      <div className="relative flex items-center">
                        <motion.button
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                          onClick={() => rankedOffers.length > 1 && setIsComparisonExpanded(!isComparisonExpanded)}
                          disabled={rankedOffers.length <= 1}
                          className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 transition-all ${
                            rankedOffers.length > 1 ? 'cursor-pointer hover:ring-2 hover:ring-blue-400/50' : 'cursor-default'
                          }`}
                          aria-label={isComparisonExpanded ? t('collapseComparison') : t('compareAgents')}
                          title={rankedOffers.length > 1 ? (isComparisonExpanded ? t('collapseComparison') : t('compareAgents')) : ''}
                        >
                          <Image
                            src={selectedAgent.logo}
                            alt={selectedAgent.name}
                            fill
                            className="object-contain p-1 sm:p-1.5 md:p-2"
                            sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 64px"
                          />
                        </motion.button>
                        {rankedOffers.length > 1 && (
                          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full bg-blue-500 border-2 border-gray-900 shadow-lg z-10">
                            <motion.div
                              animate={{ rotate: isComparisonExpanded ? 45 : 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-foreground dark:text-white stroke-[2.5]" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground dark:text-white leading-tight">{selectedAgent.name}</h3>
                        {selectedOffer.inStock ? (
                          <span className="flex items-center gap-1 text-xs sm:text-sm text-green-400">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">{t('inStock')}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs sm:text-sm text-red-400">
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">{t('outOfStock')}</span>
                          </span>
                        )}
                        <Badge className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 text-xs hidden sm:inline-flex">
                          #{selectedOffer.rank}
                        </Badge>
                      </div>
                      {selectedAgent.badges && selectedAgent.badges.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {selectedAgent.badges.slice(0, 2).map((badge) => (
                            <Badge
                              key={badge}
                              className="text-xs bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 px-2 py-0.5"
                            >
                              {badge}
                            </Badge>
                          ))}
              </div>
                      )}
              </div>
            </div>
          </div>

                {/* Price Info */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-muted-foreground dark:text-gray-400">{t('price')}:</span>
                    <span className="ml-1 sm:ml-2 text-foreground dark:text-white">
                      <PriceDisplay amount={selectedOffer.price} originalCurrency={selectedOffer.currency as any} />
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground dark:text-gray-400">{t('shipping')}:</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedShippingOffer(selectedOffer)
                        setShippingDetailOpen(true)
                      }}
                      className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
                      aria-label={t('viewShippingDetails')}
                    >
                      <PriceDisplay amount={selectedOffer.shipFee} originalCurrency={selectedOffer.currency as any} />
                    </button>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-muted-foreground dark:text-gray-400">{t('estimatedDays')}:</span>
                    <span className="ml-1 sm:ml-2 text-foreground dark:text-white">{selectedOffer.estDays} {t('days')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground dark:text-gray-400">{t('total')}:</span>
                    <span className="ml-1 sm:ml-2 text-foreground dark:text-white">
                      <PriceDisplay amount={total} originalCurrency={selectedOffer.currency as any} size="lg" />
                    </span>
                  </div>
                </div>

                {/* Promo Text */}
                {selectedAgent.promoText && (
                  <div className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-50 border border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 break-words">{selectedAgent.promoText}</p>
                  </div>
                )}

                {/* SKU Selector */}
                {product.skuOptions && product.skuOptions.length > 0 && (
                  <div className="pt-1 sm:pt-2">
                    <SKUSelector
                      options={product.skuOptions}
                      value={selectedSKU}
                      onChange={setSelectedSKU}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1 sm:pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleRedirect(trackingUrl)}
                    disabled={!selectedOffer.inStock}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-xs sm:text-sm py-2 sm:py-1.5"
                  >
                    <span className="truncate">{t('buyOnAgent', { agent: selectedAgent.name })}</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddToList}
                    disabled={
                      !selectedOffer.inStock ||
                      (product.skuOptions && product.skuOptions.length > 0 &&
                       !product.skuOptions.every((option) => selectedSKU[option.name]))
                    }
                    variant="outline"
                    className="flex-1 glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-gray-100 dark:bg-transparent text-xs sm:text-sm py-2 sm:py-1.5"
                    style={{ backdropFilter: 'none', '--panel': 'transparent' } as React.CSSProperties & { '--panel': string }}
                  >
                    {t('addToList')}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Bottom Arrow Button - Compare More Prices / Collapse */}
            {rankedOffers.length > 1 && (
              <AnimatePresence mode="wait">
                {!isComparisonExpanded ? (
                  <motion.button
                    key="expand"
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={() => setIsComparisonExpanded(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 bg-blue-50 dark:bg-blue-600/10 px-4 py-3 text-sm text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-100 dark:hover:bg-blue-600/20 hover:border-blue-600/50 dark:hover:border-blue-600/50"
                    aria-label={t('compareMorePrices')}
                  >
                    <span>{t('compareMorePrices')}</span>
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                ) : (
                  <motion.button
                    key="collapse"
                    initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={() => setIsComparisonExpanded(false)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 bg-blue-50 dark:bg-blue-600/10 px-4 py-3 text-sm text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-100 dark:hover:bg-blue-600/20 hover:border-blue-600/50 dark:hover:border-blue-600/50"
                    aria-label={t('collapseComparison')}
                  >
                    <span>{t('collapseComparison')}</span>
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                )}
              </AnimatePresence>
            )}

            {/* Comparison Panel */}
            {rankedOffers.length > 1 && (
              <AnimatePresence>
                {isComparisonExpanded && (
                  <motion.div
                    initial={shouldReduceMotion ? undefined : { opacity: 0, height: 0, y: -10 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, height: 'auto', y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0, y: -10 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                      height: { duration: 0.3 }
                    }}
                    className="space-y-3 overflow-visible"
                  >
                    <motion.h3 
                      initial={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="text-lg font-semibold text-foreground dark:text-white mb-4"
                    >
                      {t('compareAgents')}
                    </motion.h3>
                    {rankedOffers.map((offer, index) => {
                      const agent = agents.find((a) => a.id === offer.agentId)
                      const isSelected = offer.agentId === selectedAgentId
                      const offerTotal = offer.price + offer.shipFee

                      return (
                        <motion.div
                          key={offer.agentId}
                          initial={shouldReduceMotion ? undefined : { opacity: 0, x: -20, scale: 0.95 }}
                          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
                          exit={shouldReduceMotion ? undefined : { opacity: 0, x: -20, scale: 0.95 }}
                          transition={{ 
                            delay: index * 0.05 + 0.15,
                            duration: 0.3,
                            ease: 'easeOut'
                          }}
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.02, x: 4 }}
                          className={`relative rounded-xl border-2 p-4 pl-12 space-y-3 cursor-pointer transition-all overflow-visible ${
                            isSelected
                              ? 'border-blue-400/70 dark:bg-blue-500/10 hover:border-blue-400'
                              : 'border-white/10 dark:bg-transparent hover:border-blue-500/50'
                          }`}
                          style={!isSelected ? { backdropFilter: 'none', background: 'transparent' } : undefined}
                          onClick={() => setSelectedAgentId(offer.agentId)}
                        >
                          {/* Checkbox in top-left corner */}
                          <motion.button
                            whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAgentId(offer.agentId)
                            }}
                            className={`absolute top-3 left-3 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border-2 transition-all ${
                              isSelected
                                ? 'border-blue-400 bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
                            }`}
                            aria-label={isSelected ? t('selectAgent') : t('compareAgents')}
                            aria-checked={isSelected}
                            role="checkbox"
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{ duration: 0.2, ease: 'easeOut' }}
                                >
                                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-foreground dark:text-white stroke-[3]" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.button>

                          <div className="flex items-start">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {agent?.logo && (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                                  <Image
                                    src={agent.logo}
                                    alt={agent.name}
                                    fill
                                    className="object-contain p-1.5"
                                    sizes="48px"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  <h4 className="font-semibold text-foreground dark:text-white leading-tight">{agent?.name || offer.agentId}</h4>
                                  {offer.inStock ? (
                                    <span className="flex items-center gap-1 text-xs text-green-400">
                                      <CheckCircle className="h-3 w-3" />
                                      <span className="hidden sm:inline">{t('inStock')}</span>
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-xs text-red-400">
                                      <XCircle className="h-3 w-3" />
                                      <span className="hidden sm:inline">{t('outOfStock')}</span>
                                    </span>
                                  )}
                                  <Badge className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 text-xs">
                                    #{offer.rank}
                                  </Badge>
                                  <Badge className="bg-green-600/20 text-green-300 border-green-600/30 text-xs">
                                    {offer.score}/100
                                  </Badge>
              </div>
                                <Badge variant="outline" className="text-xs border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 bg-blue-50 dark:bg-transparent text-blue-700 dark:text-blue-300 mb-1">
                                  {t(`scoreReasons.${offer.scoreReason}`)}
                                </Badge>
                                {agent?.badges && agent.badges.length > 0 && (
                                  <div className="flex gap-1.5 flex-wrap mt-1">
                                    {agent.badges.slice(0, 2).map((badge) => (
                                      <Badge
                                        key={badge}
                                        className="text-xs bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 px-2 py-0.5"
                                      >
                                        {badge}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground dark:text-gray-400">{t('price')}:</span>
                              <span className="ml-2 text-foreground dark:text-white">
                                <PriceDisplay amount={offer.price} originalCurrency={offer.currency as any} />
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground dark:text-gray-400">{t('shipping')}:</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedShippingOffer(offer)
                                  setShippingDetailOpen(true)
                                }}
                                className="ml-2 text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors"
                                aria-label={t('viewShippingDetails')}
                              >
                                <PriceDisplay amount={offer.shipFee} originalCurrency={offer.currency as any} />
                              </button>
                            </div>
                            <div>
                              <span className="text-muted-foreground dark:text-gray-400">{t('estimatedDays')}:</span>
                              <span className="ml-2 text-foreground dark:text-white">{offer.estDays} {t('days')}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground dark:text-gray-400">{t('total')}:</span>
                              <span className="ml-2 text-foreground dark:text-white">
                                <PriceDisplay amount={offerTotal} originalCurrency={offer.currency as any} />
                              </span>
          </div>
        </div>

                          {agent?.promoText && (
                            <div className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-50 border border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 rounded-lg p-2">
                              <p className="text-xs text-blue-700 dark:text-blue-300 break-words">{agent.promoText}</p>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )}

        {product.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground dark:text-gray-500">{t('tagsTitle')}</p>
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="rounded-full border border-white/5 dark:border-white/5 border-gray-200/50 bg-gray-100 dark:bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground dark:text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          {selectedOffer && selectedOffer.link && (
              <Button
              onClick={() => handleRedirect(trackingUrl)}
              variant="ghost"
              className="btn-ripple group flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 touch-manipulation"
              >
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                {t('viewSource')}
              </Button>
          )}
          {category && (
            <Button
              asChild
              variant="ghost"
              className="btn-ripple group flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm text-cyan-100 hover:bg-white/5 touch-manipulation"
            >
              <Link href={`/${locale}/search?cat=${category.id}`}>
                {t('viewCategory')}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          )}
        </div>
        <RedirectDisclaimer
          open={redirectDialogOpen}
          onContinue={handleRedirectContinue}
          onCancel={handleRedirectCancel}
        />
        <ShippingDetailDialog
          open={shippingDetailOpen}
          onOpenChange={setShippingDetailOpen}
          agent={selectedShippingOffer ? agents.find((a) => a.id === selectedShippingOffer.agentId) || null : null}
          offer={selectedShippingOffer || undefined}
        />
      </div>
    </motion.section>
  )
}
