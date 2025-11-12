'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface RecommendRibbonProps {
  className?: string
}

export function RecommendRibbon({ className }: RecommendRibbonProps) {
  const shouldReduceMotion = useReducedMotion()
  const t = useTranslations('common')

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { scale: 0 }}
      animate={shouldReduceMotion ? {} : { scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative ${className || ''}`}
      aria-label={t('recommended')}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 blur-sm" />
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-bl-lg shadow-lg">
          <span className="relative z-10">{t('recommended')}</span>
        </div>
      </div>
    </motion.div>
  )
}

