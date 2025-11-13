'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

export function HeroSearch() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('home')
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const magnetX = useMotionValue(0)
  const magnetY = useMotionValue(0)
  const springX = useSpring(magnetX, { stiffness: 220, damping: 20 })
  const springY = useSpring(magnetY, { stiffness: 220, damping: 20 })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2
    magnetX.set(offsetX * 0.08)
    magnetY.set(offsetY * 0.08)
  }

  const resetMagnet = () => {
    magnetX.set(0)
    magnetY.set(0)
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto w-full max-w-2xl">
      <motion.div
        className={cn(
          'group relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/20 border-gray-300/50 bg-white/80 dark:bg-white/10 p-1',
          'shadow-[0_35px_120px_rgba(0,0,0,0.1)] dark:shadow-[0_35px_120px_rgba(6,9,25,0.65)] backdrop-blur-xl transition-all duration-500 will-change-transform',
          isFocused && 'border-blue-500/60 dark:border-white/40 shadow-[0_0_55px_rgba(59,130,246,0.3)] dark:shadow-[0_0_55px_rgba(125,211,252,0.45)] bg-white dark:bg-white/15'
        )}
        style={!shouldReduceMotion ? { x: springX, y: springY } : undefined}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetMagnet}
      >
        {/* Glass gradient overlay */}
        <div className={cn(
          "pointer-events-none absolute inset-0 z-0 rounded-3xl bg-gradient-to-br from-white/20 via-white/5 to-transparent transition-opacity duration-500",
          isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />
        {/* Colored glow effect */}
        <div className={cn(
          "pointer-events-none absolute inset-0 z-0 rounded-3xl bg-gradient-to-r from-sky-300/30 via-blue-400/20 to-violet-300/30 blur-2xl transition-opacity duration-500",
          isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )} />
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-sky-300/30 via-transparent to-violet-300/30 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex flex-col gap-3 sm:pr-32">
          <Input
            type="text"
            value={query}
            aria-label={t('searchPlaceholder')}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="relative z-10 w-full rounded-2xl border-transparent bg-transparent pl-12 sm:pl-14 pr-4 py-4 sm:py-5 md:py-6 text-base sm:text-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 focus-visible:ring-0 caret-blue-600 dark:caret-sky-300 touch-manipulation"
          />
          <Button
            type="submit"
            className="z-20 w-full rounded-2xl bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 px-6 py-3 text-sm sm:text-base font-semibold text-gray-900 shadow-[0_18px_40px_rgba(59,130,246,0.35)] hover:shadow-[0_25px_45px_rgba(192,132,252,0.35)] sm:absolute sm:right-3 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 touch-manipulation"
          >
            {t('search')}
          </Button>
        </div>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 sm:left-6 top-5 sm:top-7 z-20 h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-slate-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-cyan-200 sm:top-1/2 sm:-translate-y-1/2"
        />
      </motion.div>
    </form>
  )
}
