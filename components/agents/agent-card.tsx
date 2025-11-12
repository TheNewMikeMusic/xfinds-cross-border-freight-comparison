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
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.01,
            }
      }
      className="group"
    >
      <Card className="glass-card relative overflow-hidden border-blue-600/30 bg-gray-900/75 flex flex-col h-full min-h-[200px] sm:min-h-[240px]">
        {agent.recommended && (
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
            <RecommendRibbon />
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 blur-3xl" />
        </div>

        <CardHeader className="relative p-3 sm:p-6 h-[72px] sm:h-auto">
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-1 items-center gap-2 sm:gap-4">
              <div className="relative flex h-10 w-10 sm:h-16 sm:w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 shadow-[0_15px_35px_rgba(56,189,248,0.35)]">
                {agent.logo ? (
                  <Image
                    src={agent.logo}
                    alt={agent.name}
                    fill
                    className="object-contain p-1.5 sm:p-2"
                    sizes="(max-width: 640px) 40px, 64px"
                  />
                ) : (
                  <span className="text-lg sm:text-2xl font-bold text-white">{agent.name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="mb-0.5 sm:mb-1 truncate text-sm sm:text-lg text-white">{agent.name}</CardTitle>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-amber-300" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-semibold text-amber-200">{agent.rating}</span>
                  <span className="sr-only">
                    {t('rating')} {agent.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative flex flex-col space-y-3 p-3 sm:p-6 flex-1 min-h-0">
          <div className="h-[64px] sm:h-auto">
            {agent.promoText ? (
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 8 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                className="rounded-xl sm:rounded-2xl border border-blue-500/30 bg-blue-600/10 p-2 sm:p-3 text-xs sm:text-sm text-blue-100 shadow-[0_10px_30px_rgba(37,99,235,0.25)] line-clamp-3 sm:line-clamp-2 h-full flex items-center"
              >
                {agent.promoText}
              </motion.div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 h-[28px] sm:h-auto">
            {/* Mobile: Show speedTag as badge, Desktop: Show speedTag + all badges */}
            <div className="flex flex-wrap gap-1 items-center">
              {/* Mobile: Single tag (first badge or speedTag) */}
              {agent.badges.length > 0 ? (
                <Badge className="sm:hidden rounded-full border-white/5 bg-white/5 text-xs text-gray-400 px-1.5 py-0.5">
                  {agent.badges[0]}
                </Badge>
              ) : (
                <Badge className="sm:hidden rounded-full border-white/5 bg-white/5 text-xs text-gray-400 px-1.5 py-0.5">
                  {agent.speedTag}
                </Badge>
              )}
              
              {/* Desktop: Show speedTag + all badges */}
              <Badge className="hidden sm:inline-flex rounded-full border-blue-500/30 bg-blue-500/10 text-xs text-blue-200 px-2 py-0.5">
                {agent.speedTag}
              </Badge>
              {agent.badges.map((badge) => (
                <Badge key={badge} className="hidden sm:inline-flex rounded-full border-white/5 bg-white/5 text-xs text-gray-400 px-1.5 py-0.5">
                  {badge}
                </Badge>
              ))}
              {agent.recommended && (
                <Badge className="hidden sm:inline-flex rounded-full border-blue-500/20 bg-blue-500/10 text-xs text-blue-300 px-1.5 py-0.5">
                  {t('recommended')}
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-auto pt-2">
            <Button
              asChild
              className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-base font-semibold text-white shadow-[0_15px_45px_rgba(14,165,233,0.35)]"
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
