'use client'

import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { useCartStore, CartItem } from '@/store/cart-store'
import { PriceDisplay } from '@/components/shared/price-display'
import { formatPrice } from '@/lib/currency'
import { ExternalLink, X } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Agent, Product } from '@/lib/data'
import { getAgentTrackingUrl } from '@/lib/agent-utils'
import { groupCartItemsByAgent, calculateCartTotal, AgentGroup } from '@/lib/cart-utils'
import { AgentSwitcher } from '@/components/cart/agent-switcher'
import { RedirectDisclaimer, hasSeenRedirectDisclaimer } from '@/components/shared/redirect-disclaimer'
import { ShippingDetailDialog } from '@/components/shared/shipping-detail-dialog'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { optimizeCartItems } from '@/lib/optimization'
import { OptimizingOverlay } from '@/components/cart/optimizing-overlay'

export default function CartPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('cart')
  const { items, removeItem, clear, updateItemAgent } = useCartStore()
  const [agents, setAgents] = useState<Agent[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false)
  const [pendingGroupCheckout, setPendingGroupCheckout] = useState<AgentGroup | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [shippingDetailOpen, setShippingDetailOpen] = useState(false)
  const [selectedShippingGroup, setSelectedShippingGroup] = useState<AgentGroup | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [originalItems, setOriginalItems] = useState<CartItem[]>([])
  const { toast } = useToast()
  const shouldReduceMotion = useReducedMotion()

  // Handle hydration to prevent SSR mismatch
  useEffect(() => {
    setIsHydrated(true)
    // Rehydrate cart store after mount
    useCartStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    fetch('/api/agents')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch agents')
        }
        return res.json()
      })
      .then(setAgents)
      .catch((error) => {
        console.error('Failed to fetch agents:', error)
        setAgents([])
      })
    
    // Load products for display
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products')
        }
        return res.json()
      })
      .then(setProducts)
      .catch((error) => {
        console.error('Failed to fetch products:', error)
        setProducts([])
      })
  }, [])

  // Group items by agent - only after hydration
  const groups = useMemo(() => {
    if (!isHydrated || items.length === 0) return []
    return groupCartItemsByAgent(items, agents)
  }, [items, agents, isHydrated])

  // Calculate total
  const total = useMemo(() => {
    return calculateCartTotal(groups)
  }, [groups])

  // Reset optimization state when cart is cleared
  useEffect(() => {
    if (items.length === 0) {
      setIsOptimized(false)
      setOriginalItems([])
    }
  }, [items.length])

  // Get product info for display
  const getProduct = (productId: string): Product | null => {
    return products.find((p) => p.id === productId) || null
  }

  // Handle agent switch
  const handleAgentSwitch = async (offerId: string, newAgentId: string) => {
    const item = items.find((i) => i.offerId === offerId)
    if (!item) return

    const product = getProduct(item.productId)
    if (!product) return

    // Find offer for new agent
    const newOffer = product.offers.find((o) => o.agentId === newAgentId)
    if (!newOffer) return

    // Update item agent
    updateItemAgent(
      offerId,
      newAgentId,
      newOffer.price,
      newOffer.shipFee,
      newOffer.link
    )
  }

  // Handle group checkout
  const handleGroupCheckout = (group: AgentGroup) => {
    if (hasSeenRedirectDisclaimer()) {
      // Open all links in the group
      group.items.forEach((item, index) => {
        setTimeout(() => {
          try {
            const agent = agents.find((a) => a.id === group.agentId)
            const url = agent ? getAgentTrackingUrl(agent, item.link) : `${item.link}?source=xfinds`
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
            if (!newWindow && index === 0) {
              console.warn('Popup blocked. Please allow popups for this site.')
            }
          } catch (error) {
            console.error('Failed to open link:', error)
          }
        }, index * 200)
      })
    } else {
      setPendingGroupCheckout(group)
      setRedirectDialogOpen(true)
    }
  }

  const handleRedirectContinue = () => {
    if (pendingGroupCheckout) {
      pendingGroupCheckout.items.forEach((item, index) => {
        setTimeout(() => {
          try {
            const agent = agents.find((a) => a.id === pendingGroupCheckout.agentId)
            const url = agent ? getAgentTrackingUrl(agent, item.link) : `${item.link}?source=xfinds`
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
            if (!newWindow && index === 0) {
              console.warn('Popup blocked. Please allow popups for this site.')
            }
          } catch (error) {
            console.error('Failed to open link:', error)
          }
        }, index * 200)
      })
    }
    setRedirectDialogOpen(false)
    setPendingGroupCheckout(null)
  }

  const handleRedirectCancel = () => {
    setRedirectDialogOpen(false)
    setPendingGroupCheckout(null)
  }

  // Handle one-click optimization
  const handleOptimizeCart = async () => {
    if (items.length === 0 || agents.length === 0 || products.length === 0) {
      return
    }

    // Save original items before optimization
    if (!isOptimized) {
      setOriginalItems([...items])
    }

    setIsOptimizing(true)

    // Simulate analysis delay (2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500))

    try {
      // Calculate optimal assignment
      const result = optimizeCartItems(items, agents, products)

      if (result.changes.length === 0) {
        toast({
          title: t('optimizationComplete'),
          description: t('noChangesNeeded'),
        })
        setIsOptimizing(false)
        return
      }

      // Apply optimizations
      result.optimizedItems.forEach((optimizedItem) => {
        const originalItem = items.find((i) => i.offerId === optimizedItem.offerId)
        if (!originalItem) return

        // Only update if agent changed
        if (originalItem.agentId !== optimizedItem.agentId) {
          updateItemAgent(
            optimizedItem.offerId,
            optimizedItem.agentId,
            optimizedItem.price,
            optimizedItem.shipFee,
            optimizedItem.link
          )
        }
      })

      // Show success message
      toast({
        title: t('optimizationComplete'),
        description: t('optimizationCompleteDesc', {
          amount: formatPrice(result.savings, 'CNY'),
        }),
      })

      setIsOptimized(true)
    } catch (error) {
      console.error('Optimization failed:', error)
      toast({
        title: 'Error',
        description: t('optimizationFailed'),
        variant: 'destructive',
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  // Handle cancel optimization
  const handleCancelOptimization = () => {
    if (originalItems.length === 0) return

    // Restore original items
    originalItems.forEach((originalItem) => {
      const currentItem = items.find((i) => i.offerId === originalItem.offerId)
      if (!currentItem) return

      // Restore if agent changed
      if (currentItem.agentId !== originalItem.agentId) {
        updateItemAgent(
          originalItem.offerId,
          originalItem.agentId,
          originalItem.price,
          originalItem.shipFee,
          originalItem.link
        )
      }
    })

    setIsOptimized(false)
    setOriginalItems([])

    toast({
      title: t('optimizationCancelled'),
      description: t('optimizationCancelledDesc'),
    })
  }

  // Show loading state during hydration to prevent SSR mismatch
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-400">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show empty state only after hydration
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <EmptyState
            title={t('empty')}
            description={t('emptyDesc')}
            action={
              <Button asChild className="mt-4">
                <Link href={`/${locale}/search`}>{t('browseProducts')}</Link>
              </Button>
            }
          />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-sky-200 via-blue-300 to-violet-400 bg-clip-text text-4xl font-semibold text-transparent">
                {t('title')}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                {t('itemCount')}: {items.length} · {t('estimatedTotal')}: <PriceDisplay amount={total} originalCurrency="CNY" size="sm" />
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={isOptimized ? handleCancelOptimization : handleOptimizeCart}
                disabled={isOptimizing || items.length === 0}
                className="btn-ripple rounded-2xl border-2 border-green-500 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-base font-bold text-white shadow-xl shadow-green-500/30 hover:from-green-500 hover:to-emerald-500 hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-sm"
              >
                <Zap className="mr-2 h-5 w-5" />
                {isOptimized ? t('cancelAI') : t('aiHelpSaveMoney')}
              </Button>
              <Button
                onClick={clear}
                className="btn-ripple rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                {t('clear')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 lg:col-span-2">
              <AnimatePresence>
                {groups.map((group) => {
                  const agent = group.agent
                  const totalWeight = group.items.reduce((sum, item) => sum + (item.weight || 0), 0)
                  const hasWeight = group.items.some((item) => item.weight !== undefined)

                  return (
                    <motion.div
                      key={group.agentId}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="glass border-blue-600/30 bg-gray-900/75">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {agent?.logo && (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                                  <Image
                                    src={agent.logo}
                                    alt={agent.name}
                                    fill
                                    className="object-contain p-2"
                                    sizes="48px"
                                  />
                                </div>
                              )}
                              <div>
                                <CardTitle className="text-xl text-white">{agent?.name || group.agentId}</CardTitle>
                                <p className="text-sm text-slate-400 mt-1">
                                  {t('itemsInGroup', { count: group.items.length })}
                                </p>
                              </div>
                            </div>
                            {agent?.promoText && (
                              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg px-3 py-1">
                                <p className="text-xs text-blue-300">{agent.promoText}</p>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Items list */}
                          <div className="space-y-3">
                            {group.items.map((item) => {
                              const product = getProduct(item.productId)
                              return (
                                <motion.div
                                  key={item.offerId}
                                  layoutId={`item-${item.offerId}`}
                                  layout={!shouldReduceMotion}
                                  initial={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
                                  animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                                  transition={shouldReduceMotion ? undefined : { duration: 0.3 }}
                                  className="flex items-start gap-4 p-3 rounded-xl border border-white/10 bg-white/5"
                                >
                                  {product?.cover && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image
                                        src={product.cover}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-white mb-1 truncate">
                                      {product?.title || item.productId}
                                    </h4>
                                    {item.sku && Object.keys(item.sku).length > 0 && (
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        {Object.entries(item.sku).map(([key, value]) => (
                                          <span
                                            key={key}
                                            className="inline-flex items-center gap-1 rounded-full border border-blue-600/30 bg-blue-600/10 px-2 py-0.5 text-xs text-blue-300"
                                          >
                                            <span className="text-blue-400">{key}:</span>
                                            <span>{value}</span>
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                                      <span>{t('price')}: <PriceDisplay amount={item.price} originalCurrency="CNY" size="sm" /></span>
                                      <span>{t('shipping')}: <PriceDisplay amount={item.shipFee} originalCurrency="CNY" size="sm" /></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-slate-500">{t('switchAgent')}:</span>
                                      <div className="flex-1 max-w-xs">
                                        {(() => {
                                          const product = getProduct(item.productId)
                                          const availableAgents = product
                                            ? agents.filter((a) =>
                                                product.offers.some((o) => o.agentId === a.id)
                                              )
                                            : agents
                                          return (
                                            <AgentSwitcher
                                              currentAgentId={item.agentId}
                                              agents={availableAgents}
                                              onAgentChange={(newAgentId) => handleAgentSwitch(item.offerId, newAgentId)}
                                            />
                                          )
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(item.offerId)}
                                    className="text-slate-400 hover:text-red-400"
                                    aria-label={t('remove')}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              )
                            })}
                          </div>

                          {/* Group summary */}
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">{t('subtotal')}</p>
                              <div className="text-lg font-semibold text-white">
                                <PriceDisplay amount={group.subtotal} originalCurrency="CNY" />
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">{t('groupShipping')}</p>
                              <button
                                onClick={() => {
                                  setSelectedShippingGroup(group)
                                  setShippingDetailOpen(true)
                                }}
                                className="text-lg font-semibold text-blue-300 hover:text-blue-200 underline cursor-pointer transition-colors text-left"
                                aria-label={t('viewShippingDetails')}
                              >
                                {group.estimatedShipping.min === group.estimatedShipping.max ? (
                                  <PriceDisplay amount={group.estimatedShipping.min} originalCurrency={group.estimatedShipping.currency as any} />
                                ) : (
                                  <>
                                    <PriceDisplay amount={group.estimatedShipping.min} originalCurrency={group.estimatedShipping.currency as any} /> - <PriceDisplay amount={group.estimatedShipping.max} originalCurrency={group.estimatedShipping.currency as any} />
                                  </>
                                )}
                              </button>
                            </div>
                            {hasWeight && (
                              <div className="col-span-2">
                                <p className="text-xs text-slate-400 mb-1">{t('totalWeight')}</p>
                                <p className="text-sm text-slate-300">
                                  {totalWeight > 0 ? `${totalWeight.toFixed(2)} kg` : t('weightUnknown')}
                                </p>
                              </div>
                            )}
                            <div className="col-span-2 pt-2 border-t border-white/10">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-white">{t('groupTotal')}</p>
                                <div className="text-xl font-bold bg-gradient-to-r from-sky-200 to-violet-300 bg-clip-text text-transparent">
                                  <PriceDisplay amount={group.total} originalCurrency="CNY" size="lg" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Checkout button */}
                          <Button
                            onClick={() => handleGroupCheckout(group)}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t('checkoutAtAgent', { agent: agent?.name || group.agentId })}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <Card className="glass sticky top-24 max-h-[calc(100vh-8rem)] border-white/10 bg-gradient-to-br from-[rgba(7,11,20,0.95)] via-[rgba(5,8,15,0.92)] to-[rgba(2,4,8,0.95)] overflow-hidden flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="text-2xl text-white">{t('summary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-6 flex-1 overflow-y-auto">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>{t('itemCount')}</span>
                    <span className="font-semibold text-white">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>{t('estimatedTotal')}</span>
                    <span className="font-semibold text-white"><PriceDisplay amount={total} originalCurrency="CNY" /></span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>{t('total')}</span>
                      <div className="bg-gradient-to-r from-sky-200 to-violet-300 bg-clip-text text-transparent">
                        <PriceDisplay amount={total} originalCurrency="CNY" size="lg" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
        <RedirectDisclaimer
          open={redirectDialogOpen}
          onContinue={handleRedirectContinue}
          onCancel={handleRedirectCancel}
        />
        <ShippingDetailDialog
          open={shippingDetailOpen}
          onOpenChange={setShippingDetailOpen}
          agent={selectedShippingGroup?.agent || null}
          cartItems={selectedShippingGroup?.items}
          estimatedShipping={selectedShippingGroup?.estimatedShipping}
        />
        <OptimizingOverlay isVisible={isOptimizing} />
      </>
    )
  }
