'use client'

import { Suggestion } from '@/lib/assistant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PriceDisplay } from '@/components/shared/price-display'
import { useTranslations } from 'next-intl'
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

interface AssistantSuggestionsProps {
  suggestions: Suggestion[]
  onApply: (suggestion: Suggestion) => void
  onDismiss: (suggestionId: string) => void
}

export function AssistantSuggestions({
  suggestions,
  onApply,
  onDismiss,
}: AssistantSuggestionsProps) {
  const t = useTranslations('assistant')
  const shouldReduceMotion = useReducedMotion()

  if (suggestions.length === 0) {
    return (
      <Card className="glass border-green-600/30 dark:border-green-600/30 border-green-500/30 bg-white dark:bg-gray-900/75">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
              {t('noSuggestions')}
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">{t('noSuggestionsDesc')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-foreground dark:text-white">{t('suggestions')}</h3>
      </div>
      {suggestions.map((suggestion) => (
        <motion.div
          key={suggestion.id}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:bg-gray-900/75">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-foreground dark:text-white mb-2">
                    {suggestion.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="border-blue-600/30 dark:border-blue-600/30 border-blue-500/50 bg-blue-50 dark:bg-transparent text-blue-700 dark:text-blue-300 mb-2"
                  >
                    {suggestion.type === 'promo_optimization'
                      ? t('promoOptimization')
                      : suggestion.type === 'agent_switch'
                      ? t('agentSwitch')
                      : t('splitParcel')}
                  </Badge>
                  <p className="text-sm text-muted-foreground dark:text-gray-300 mt-2">{suggestion.reason}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    -<PriceDisplay amount={suggestion.savings} originalCurrency="CNY" size="lg" />
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">{t('savings')}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-white/10 dark:border-white/10 border-gray-200/50 bg-gray-50 dark:bg-white/5 p-3">
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mb-1">{t('before')}</p>
                  <div className="text-foreground dark:text-white font-semibold">
                    <PriceDisplay amount={suggestion.before.totalCost} originalCurrency="CNY" />
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                    {t('shipping')}: <PriceDisplay amount={suggestion.before.shippingCost} originalCurrency="CNY" size="sm" />
                  </p>
                </div>
                <div className="rounded-xl border border-green-600/30 dark:border-green-600/30 border-green-500/30 bg-green-50 dark:bg-green-600/10 p-3">
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mb-1">{t('after')}</p>
                  <div className="text-foreground dark:text-white font-semibold">
                    <PriceDisplay amount={suggestion.after.totalCost} originalCurrency="CNY" />
                  </div>
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                    {t('shipping')}: <PriceDisplay amount={suggestion.after.shippingCost} originalCurrency="CNY" size="sm" />
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onApply(suggestion)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400"
                >
                  {t('apply')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onDismiss(suggestion.id)}
                  className="border-white/10 dark:border-white/10 border-gray-200/50 bg-gray-100 dark:bg-white/5 text-foreground dark:text-white hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  {t('dismiss')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

