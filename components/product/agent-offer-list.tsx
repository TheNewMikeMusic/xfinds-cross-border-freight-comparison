'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductOffer, Agent } from '@/lib/data'
import { PriceDisplay } from '@/components/shared/price-display'
import { ExternalLink, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { getAgentTrackingUrl, getCleanSiteUrl } from '@/lib/agent-utils'
import { CopyLinkButton } from '@/components/shared/copy-link-button'
import { rankOffers, RankedOffer } from '@/lib/ranking'
import { RedirectDisclaimer, hasSeenRedirectDisclaimer } from '@/components/shared/redirect-disclaimer'
import { RecommendRibbon } from '@/components/shared/recommend-ribbon'
import { EmptyState } from '@/components/shared/empty-state'
import { ShippingDetailDialog } from '@/components/shared/shipping-detail-dialog'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Product } from '@/lib/data'
import { SKUSelector, SelectedSKU } from '@/components/product/sku-selector'

interface AgentOfferListProps {
  offers: ProductOffer[]
  agents: Agent[]
  productId: string
  product?: Product // Optional product for SKU options
}

export function AgentOfferList({
  offers,
  agents,
  productId,
  product,
}: AgentOfferListProps) {
  const t = useTranslations('product')
  const addToCart = useCartStore((state) => state.addItem)
  const [isComparisonExpanded, setIsComparisonExpanded] = useState(false)
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false)
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null)
  const [shippingDetailOpen, setShippingDetailOpen] = useState(false)
  const [selectedShippingOffer, setSelectedShippingOffer] = useState<ProductOffer | null>(null)
  const [selectedSKU, setSelectedSKU] = useState<SelectedSKU>({})
  const shouldReduceMotion = useReducedMotion()

  // Rank offers
  const rankedOffers = useMemo(() => {
    if (offers.length === 0) return []
    return rankOffers(offers, agents)
  }, [offers, agents])

  // Initialize selectedAgentId with first offer (consistent for SSR and client)
  const defaultAgentId = rankedOffers.length > 0 ? rankedOffers[0].agentId : null
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(defaultAgentId)

  // Get selected offer - ensure consistent server/client rendering
  const selectedOffer = useMemo(() => {
    if (rankedOffers.length === 0) return null
    // Always use first offer as default to ensure SSR consistency
    const defaultOffer = rankedOffers[0]
    // Use selectedAgentId if set, otherwise use default
    const agentIdToUse = selectedAgentId || defaultAgentId
    return rankedOffers.find((o) => o.agentId === agentIdToUse) || defaultOffer
  }, [rankedOffers, selectedAgentId, defaultAgentId])
  
  const selectedAgent = useMemo(() => {
    if (!selectedOffer) return null
    return agents.find((a) => a.id === selectedOffer.agentId) || null
  }, [selectedOffer, agents])

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
    if (product?.skuOptions && product.skuOptions.length > 0) {
      const allSelected = product.skuOptions.every((option) => selectedSKU[option.name])
      if (!allSelected) {
        // Show error or prevent adding
        return
      }
    }
    
    addToCart({
      productId,
      offerId: `${productId}-${selectedOffer.agentId}-${JSON.stringify(selectedSKU)}`,
      agentId: selectedOffer.agentId,
      price: selectedOffer.price,
      shipFee: selectedOffer.shipFee,
      link: selectedOffer.link,
      sku: Object.keys(selectedSKU).length > 0 ? selectedSKU : undefined,
    })
  }

  // Empty state
  if (offers.length === 0) {
    return (
      <Card className="glass agent-offer-card-parent border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:!bg-transparent overflow-visible" style={{ background: 'transparent', '--panel': 'transparent' } as React.CSSProperties & { '--panel': string }}>
        <CardContent className="p-8 overflow-visible">
          <EmptyState
            title={t('noAgentsAvailable')}
            description={t('noAgentsDesc')}
          />
        </CardContent>
      </Card>
    )
  }

  // Single agent - no comparison needed
  if (rankedOffers.length === 1) {
    const offer = rankedOffers[0]
    const agent = agents.find((a) => a.id === offer.agentId)
    const total = offer.price + offer.shipFee
    const trackingUrl = agent ? getAgentTrackingUrl(agent, offer.link) : `${offer.link}?source=xfinds`

    return (
      <>
        <Card className="glass agent-offer-card-parent border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:!bg-transparent overflow-visible" style={{ background: 'transparent', '--panel': 'transparent' } as React.CSSProperties & { '--panel': string }}>
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <CardTitle className="text-base sm:text-lg">{t('offers')}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
                <span>{t('offerCount', { count: 1 })}</span>
                {offer.inStock && (
                  <>
                    <span className="text-muted-foreground/50 dark:text-gray-600">•</span>
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      {t('inStock')}
                    </span>
                  </>
                )}
                {agent?.recommended && (
                  <>
                    <span className="text-muted-foreground/50 dark:text-gray-600">•</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{t('recommended')}</span>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 overflow-visible">
            <div className="glass agent-offer-card border border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-gray-50 dark:!bg-transparent p-3 sm:p-4 md:p-6 rounded-xl space-y-2 sm:space-y-3 md:space-y-4 relative" style={{ background: 'transparent', overflow: 'visible', '--panel': 'transparent', backdropFilter: 'none' } as React.CSSProperties & { '--panel': string }}>
              {agent?.recommended && (
                <div className="absolute -top-2 -right-2 z-30 overflow-visible">
                  <RecommendRibbon />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                  {agent?.logo && (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                      <Image
                        src={agent.logo}
                        alt={agent.name}
                        fill
                        className="object-contain p-1 sm:p-1.5 md:p-2"
                        sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                      <h4 className="font-semibold text-sm sm:text-base md:text-lg text-foreground dark:text-white">{agent?.name || offer.agentId}</h4>
                      {agent?.recommended && (
                        <Badge className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 text-xs">
                          {t('recommended')}
                        </Badge>
                      )}
                    </div>
                    {agent?.badges && agent.badges.length > 0 && (
                      <div className="flex gap-1 sm:gap-2 flex-wrap mt-1 sm:mt-2">
                        {agent.badges.slice(0, 2).map((badge) => (
                          <Badge
                            key={badge}
                            className="text-xs bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {offer.inStock ? (
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-green-400 flex-shrink-0">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('inStock')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-red-400 flex-shrink-0">
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('outOfStock')}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">{t('price')}:</span>
                  <span className="ml-1 sm:ml-2">
                    <PriceDisplay amount={offer.price} originalCurrency={offer.currency as any} />
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">{t('shipping')}:</span>
                  <button
                    onClick={() => {
                      setSelectedShippingOffer(offer)
                      setShippingDetailOpen(true)
                    }}
                    className="ml-1 sm:ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
                    aria-label={t('viewShippingDetails')}
                  >
                    <PriceDisplay amount={offer.shipFee} originalCurrency={offer.currency as any} />
                  </button>
                </div>
                <div className="hidden sm:block">
                  <span className="text-muted-foreground dark:text-gray-400">{t('estimatedDays')}:</span>
                  <span className="ml-1 sm:ml-2">{offer.estDays} {t('days')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">{t('total')}:</span>
                  <span className="ml-1 sm:ml-2">
                    <PriceDisplay amount={total} originalCurrency={offer.currency as any} size="lg" />
                  </span>
                </div>
              </div>

              {agent?.promoText && (
                <div className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-50 border border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 break-words">{agent.promoText}</p>
                </div>
              )}

              {product?.skuOptions && product.skuOptions.length > 0 && (
                <div className="pt-1 sm:pt-2">
                  <SKUSelector
                    options={product.skuOptions}
                    value={selectedSKU}
                    onChange={setSelectedSKU}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-1 sm:pt-2">
                <Button
                  size="sm"
                  onClick={() => handleRedirect(trackingUrl)}
                  disabled={!offer.inStock}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-xs sm:text-sm py-2 sm:py-1.5"
                >
                  <span className="truncate">{t('buyOnAgent', { agent: agent?.name || offer.agentId })}</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddToList}
                  disabled={
                    !offer.inStock ||
                    (product?.skuOptions && product.skuOptions.length > 0 &&
                     !product.skuOptions.every((option) => selectedSKU[option.name]))
                  }
                  variant="outline"
                  className="flex-1 glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-gray-100 dark:bg-transparent backdrop-blur-xl text-xs sm:text-sm py-2 sm:py-1.5"
                >
                  {t('addToList')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <RedirectDisclaimer
          open={redirectDialogOpen}
          onContinue={handleRedirectContinue}
          onCancel={handleRedirectCancel}
        />
      </>
    )
  }

  // Multiple agents - show default selected and comparison panel
  const total = selectedOffer ? selectedOffer.price + selectedOffer.shipFee : 0
  const trackingUrl = selectedAgent && selectedOffer
    ? getAgentTrackingUrl(selectedAgent, selectedOffer.link)
    : selectedOffer?.link || ''

  // Calculate statistics
  const inStockCount = rankedOffers.filter(o => o.inStock).length
  const recommendedCount = rankedOffers.filter(o => {
    const agent = agents.find(a => a.id === o.agentId)
    return agent?.recommended
  }).length

  return (
    <>
      <Card className="glass agent-offer-card-parent border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:!bg-transparent overflow-visible" style={{ background: 'transparent', '--panel': 'transparent' } as React.CSSProperties & { '--panel': string }}>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <CardTitle className="text-base sm:text-lg">{t('offers')}</CardTitle>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsComparisonExpanded(!isComparisonExpanded)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 text-xs sm:text-sm self-start sm:self-auto"
            >
              {isComparisonExpanded ? (
                <>
                  <span className="hidden sm:inline">{t('collapseComparison')}</span>
                  <span className="sm:hidden">{t('collapseComparison')}</span>
                  <ChevronUp className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">{t('compareAgents')}</span>
                  <span className="sm:hidden">{t('compareAgents')}</span>
                  <ChevronDown className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 overflow-visible">
          {/* Default selected agent */}
          {selectedOffer && selectedAgent && (
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="glass agent-offer-card border border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-gray-50 dark:!bg-transparent p-3 sm:p-4 md:p-6 rounded-xl space-y-2 sm:space-y-3 md:space-y-4 relative"
              style={{ background: 'transparent', overflow: 'visible', '--panel': 'transparent', backdropFilter: 'none' } as React.CSSProperties & { '--panel': string }}
            >
              {selectedAgent.recommended && (
                <div className="absolute -top-2 -right-2 z-30 overflow-visible">
                  <RecommendRibbon />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                  {selectedAgent.logo && (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                      <Image
                        src={selectedAgent.logo}
                        alt={selectedAgent.name}
                        fill
                        className="object-contain p-1 sm:p-1.5 md:p-2"
                        sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                      <h4 className="font-semibold text-sm sm:text-base md:text-lg text-foreground dark:text-white">{selectedAgent.name}</h4>
                      {selectedAgent.recommended && (
                        <Badge className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 text-xs">
                          {t('recommended')}
                        </Badge>
                      )}
                        <Badge className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 text-xs hidden sm:inline-flex">
                        #{selectedOffer.rank}
                      </Badge>
                      <Badge className="bg-green-600/20 text-green-300 border-green-600/30 text-xs hidden md:inline-flex">
                        {selectedOffer.score}/100
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 bg-blue-50 dark:bg-transparent text-blue-700 dark:text-blue-300 hidden sm:inline-flex">
                      {t(`scoreReasons.${selectedOffer.scoreReason}`)}
                    </Badge>
                    {selectedAgent.badges && selectedAgent.badges.length > 0 && (
                      <div className="flex gap-1 sm:gap-2 flex-wrap mt-1 sm:mt-2">
                        {selectedAgent.badges.slice(0, 2).map((badge) => (
                          <Badge
                            key={badge}
                            className="text-xs bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {selectedOffer.inStock ? (
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-green-400 flex-shrink-0">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('inStock')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-red-400 flex-shrink-0">
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{t('outOfStock')}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">{t('price')}:</span>
                  <span className="ml-1 sm:ml-2">
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
                  <span className="ml-1 sm:ml-2">{selectedOffer.estDays} {t('days')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground dark:text-gray-400">{t('total')}:</span>
                  <span className="ml-1 sm:ml-2">
                    <PriceDisplay amount={total} originalCurrency={selectedOffer.currency as any} size="lg" />
                  </span>
                </div>
              </div>

              {selectedAgent.promoText && (
                <div className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-50 border border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 break-words">{selectedAgent.promoText}</p>
                </div>
              )}

              {product?.skuOptions && product.skuOptions.length > 0 && (
                <div className="pt-1 sm:pt-2">
                  <SKUSelector
                    options={product.skuOptions}
                    value={selectedSKU}
                    onChange={setSelectedSKU}
                  />
                </div>
              )}

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
                    (product?.skuOptions && product.skuOptions.length > 0 &&
                     !product.skuOptions.every((option) => selectedSKU[option.name]))
                  }
                  variant="outline"
                  className="flex-1 glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-gray-100 dark:bg-transparent backdrop-blur-xl text-xs sm:text-sm py-2 sm:py-1.5"
                >
                  {t('addToList')}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Comparison panel */}
          <AnimatePresence>
            {isComparisonExpanded && (
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, height: 0 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, height: 'auto' }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-visible"
              >
                <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">{t('compareAgents')}</h3>
                {rankedOffers.map((offer) => {
                  const agent = agents.find((a) => a.id === offer.agentId)
                  const isSelected = offer.agentId === selectedAgentId
                  const offerTotal = offer.price + offer.shipFee

                  return (
                    <motion.div
                      key={offer.agentId}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                      className={`glass agent-offer-card border ${
                        isSelected
                          ? 'border-blue-500 bg-blue-600/10 dark:bg-blue-600/10'
                          : 'border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-gray-50 dark:bg-transparent'
                      } p-4 rounded-xl space-y-3 cursor-pointer transition-all hover:border-blue-500/50 overflow-visible`}
                      style={{ '--panel': 'transparent', backdropFilter: 'none' } as React.CSSProperties & { '--panel': string }}
                      onClick={() => setSelectedAgentId(offer.agentId)}
                    >
                      <div className="flex items-start justify-between">
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
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{agent?.name || offer.agentId}</h4>
                              <Badge className="bg-blue-600/20 dark:bg-blue-600/20 bg-blue-100 text-blue-700 dark:text-blue-300 border-blue-600/30 dark:border-blue-600/30 border-blue-500/50">
                                #{offer.rank}
                              </Badge>
                              <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
                                {offer.score}/100
                              </Badge>
                            </div>
                            <Badge variant="outline" className="text-xs border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 bg-blue-50 dark:bg-transparent text-blue-700 dark:text-blue-300">
                              {t(`scoreReasons.${offer.scoreReason}`)}
                            </Badge>
                          </div>
                        </div>
                        {isSelected && (
                          <Badge className="bg-green-600/20 text-green-300 border-green-600/30">
                            {t('selectAgent')}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground dark:text-gray-400">{t('price')}:</span>
                          <span className="ml-2">
                            <PriceDisplay amount={offer.price} originalCurrency={offer.currency as any} />
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground dark:text-gray-400">{t('shipping')}:</span>
                          <button
                            onClick={() => {
                              setSelectedShippingOffer(offer)
                              setShippingDetailOpen(true)
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
                            aria-label={t('viewShippingDetails')}
                          >
                            <PriceDisplay amount={offer.shipFee} originalCurrency={offer.currency as any} />
                          </button>
                        </div>
                        <div>
                          <span className="text-muted-foreground dark:text-gray-400">{t('estimatedDays')}:</span>
                          <span className="ml-2">{offer.estDays} {t('days')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground dark:text-gray-400">{t('total')}:</span>
                          <span className="ml-2">
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
        </CardContent>
      </Card>
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
    </>
  )
}
