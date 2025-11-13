'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ExternalLink } from 'lucide-react'
import { Agent } from '@/lib/data'
import Image from 'next/image'
import { RecommendRibbon } from '@/components/shared/recommend-ribbon'
import { getAgentTrackingUrl } from '@/lib/agent-utils'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'

interface AgentCardProps {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('agent')
  const trackingUrl = getAgentTrackingUrl(agent)
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -4,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
      }
      className="group"
    >
      <Card className={`glass-card relative ${agent.recommended ? 'overflow-visible' : 'overflow-hidden'} border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:bg-gray-900/75 flex flex-col h-full min-h-[140px] sm:min-h-[240px]`}>
        {agent.recommended && (
          <div className="absolute top-0 right-0 sm:top-1 sm:right-1 z-20 overflow-visible">
            <RecommendRibbon />
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-3xl" />
        </div>

        <CardHeader className="relative p-3 sm:p-3 md:p-6 min-h-[72px] sm:h-auto">
          <div className="flex flex-row items-start gap-3 sm:gap-4">
            {/* Logo */}
            <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white dark:bg-white shadow-[0_15px_35px_rgba(56,189,248,0.35)]">
              {agent.logo ? (
                <Image
                  src={agent.logo}
                  alt={agent.name}
                  fill
                  className="object-contain p-1.5 sm:p-2"
                  sizes="(max-width: 640px) 40px, 64px"
                />
              ) : (
                <span className="text-lg sm:text-2xl font-bold text-gray-700 dark:text-gray-700">{agent.name.charAt(0)}</span>
              )}
            </div>
            
            {/* Content Area */}
            <div className="min-w-0 flex-1 w-full sm:w-auto space-y-1 sm:space-y-0">
              <CardTitle className="mb-0.5 sm:mb-1 truncate text-base sm:text-lg text-foreground dark:text-white">{agent.name}</CardTitle>
              
              {/* Rating */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-amber-300" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-semibold text-amber-200">{agent.rating}</span>
                <span className="sr-only">
                  {t('rating')} {agent.rating}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative flex flex-col space-y-2 sm:space-y-3 p-3 sm:p-3 md:p-6 flex-1 min-h-0">
          {/* Promo Text - Below rating, same width as button */}
          {agent.promoText && (
            <Badge className="flex w-full justify-center rounded-md border-blue-500/30 dark:border-blue-500/30 border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 text-xs text-blue-700 dark:text-blue-200 px-2 py-1 break-words mb-2 sm:mb-3">
              {agent.promoText}
            </Badge>
          )}
          
          <div className="flex flex-row items-center gap-2">
            {/* Show speedTag + badges */}
            <div className="flex flex-wrap gap-1 items-center">
              <Badge className="rounded-full border-blue-500/30 dark:border-blue-500/30 border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 text-xs text-blue-700 dark:text-blue-200 px-2 py-0.5">
                {agent.speedTag}
              </Badge>
              {agent.badges.map((badge) => (
                <Badge key={badge} className="rounded-full border-white/5 dark:border-white/5 border-gray-200/50 bg-gray-100 dark:bg-white/5 text-xs text-muted-foreground dark:text-gray-400 px-1.5 py-0.5">
                  {badge}
                </Badge>
              ))}
              {agent.recommended && (
                <Badge className="rounded-full border-blue-500/20 dark:border-blue-500/20 border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 text-xs text-blue-700 dark:text-blue-300 px-1.5 py-0.5">
                  {t('recommended')}
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-auto pt-2">
            <Button
              asChild
              className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-[0_15px_45px_rgba(14,165,233,0.35)]"
            >
              <a href={trackingUrl} target="_blank" rel="noopener noreferrer" aria-label={t('enter')}>
                <span>{t('enter')}</span>
                <ExternalLink className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  )
}
