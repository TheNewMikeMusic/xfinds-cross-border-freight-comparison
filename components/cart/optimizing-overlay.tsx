'use client'

import { motion } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface OptimizingOverlayProps {
  isVisible: boolean
}

export function OptimizingOverlay({ isVisible }: OptimizingOverlayProps) {
  const t = useTranslations('cart')

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="flex flex-col items-center gap-6 rounded-2xl border border-blue-600/30 bg-gray-900/95 p-12 backdrop-blur-xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Sparkles className="h-16 w-16 text-blue-400" />
        </motion.div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-2xl font-semibold text-white">{t('optimizing')}</h3>
          <p className="text-gray-400">{t('analyzing')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-blue-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

