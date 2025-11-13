'use client'

import { HeroSearch } from '@/components/search/hero-search'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { HERO_COPY, HERO_FALLBACK_BG, type HeroBackground } from '@/content/hero'
import { useState, useRef } from 'react'

interface HeroSectionProps {
  title?: string
  subtitle?: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const [bg, setBg] = useState<HeroBackground>(HERO_COPY.background)
  const [imageError, setImageError] = useState(false)

  // Use props if provided, otherwise use config
  const displayTitle = title ?? HERO_COPY.title
  const displaySubtitle = subtitle ?? HERO_COPY.subtitle
  // Split title into two lines: "Search smarter," and "shop China."
  const titleParts = displayTitle.includes(',') 
    ? displayTitle.split(',').map(part => part.trim())
    : [displayTitle]
  const headingWords = displayTitle.split(' ')

  const headingContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeOut',
        staggerChildren: shouldReduceMotion ? 0 : 0.03,
      },
    },
  }

  const wordVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.25,
        ease: 'easeOut',
      },
    },
  }

  // CSS class for gradient text to avoid Framer Motion animation conflicts
  // Using CSS class instead of inline styles prevents animation warnings

  // Use fallback if image failed to load, otherwise use configured background
  const currentBg = imageError && bg.kind === 'image' ? HERO_FALLBACK_BG : bg

  return (
    <section className="radial-glow relative overflow-hidden px-4 py-12 sm:py-16 md:py-20">
      {/* Background */}
      {currentBg.kind === 'image' ? (
        <div className="absolute inset-0 -z-10">
          <Image
            src={currentBg.src}
            alt={currentBg.alt ?? 'Hero background'}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onError={() => {
              setImageError(true)
              setBg(HERO_FALLBACK_BG)
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-transparent dark:from-black/35 dark:via-black/20" />
        </div>
      ) : (
        <>
          {/* 日间模式背景 */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 dark:hidden"
            initial={{ opacity: 0.3, scale: 0.9 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.4 }
                : {
                    opacity: [0.3, 0.4, 0.3],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'mirror',
                  }
            }
            style={{
              background: "radial-gradient(1200px 600px at 20% 20%, rgba(59,130,246,0.12), transparent 60%), radial-gradient(1000px 500px at 80% 30%, rgba(139,92,246,0.1), transparent 60%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 45%, #ffffff 100%)",
              filter: 'blur(30px)',
            }}
          />
          {/* 夜间模式背景 - 与页面背景融合 */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.6 }
                : {
                    opacity: [0.5, 0.6, 0.5],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 8,
                    repeat: Infinity,
                    repeatType: 'mirror',
                  }
            }
            style={{
              background: "radial-gradient(1200px 600px at 20% 20%, rgba(125,211,252,0.15), transparent 60%), radial-gradient(1000px 500px at 80% 30%, rgba(192,132,252,0.12), transparent 60%), linear-gradient(180deg, #02050a 0%, #050b16 45%, #02050a 100%)",
              filter: 'blur(30px)',
            }}
          />
          {/* 夜间模式额外融合层 */}
          <div 
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(125,211,252,0.08), transparent 70%)",
            }}
          />
        </>
      )}

      <div className="container relative z-10 mx-auto text-center">
        <motion.div
          variants={headingContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-6xl"
        >
          <h1 className="mb-4 text-4xl tracking-wider sm:mb-5 sm:text-5xl sm:tracking-[0.1em] md:mb-6 md:text-6xl md:tracking-[0.12em] lg:text-7xl lg:tracking-[0.15em] font-impact leading-tight relative" style={{ fontFamily: 'Impact, "Arial Black", Arial, sans-serif', fontWeight: 'normal' }}>
            {/* Glow effect background - 日间模式 */}
            <div className="absolute inset-0 blur-2xl opacity-20 dark:opacity-40 bg-gradient-to-r from-blue-400 via-blue-500 to-violet-400 dark:from-cyan-400 dark:via-blue-500 dark:to-violet-500" />
            
            {titleParts.length > 1 ? (
              <>
                <div className="block relative">
                  {titleParts[0].split(' ').map((word, index) => (
                    <span
                      key={`line1-${word}-${index}`}
                      className="inline-block font-impact relative mr-2 sm:mr-3 md:mr-4"
                      style={{
                        fontFamily: 'Impact, "Arial Black", Arial, sans-serif',
                        fontWeight: 'normal',
                      }}
                    >
                      <motion.span
                        variants={wordVariant}
                        className="inline-block bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 bg-clip-text text-transparent dark:text-white dark:[text-shadow:0_0_10px_rgba(125,211,252,0.5),0_0_20px_rgba(125,211,252,0.4),0_0_30px_rgba(192,132,252,0.25),0_0_40px_rgba(139,92,246,0.2)] drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {word}
                      </motion.span>
                      {index < titleParts[0].split(' ').length - 1 ? '' : <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 bg-clip-text text-transparent dark:text-white dark:[text-shadow:0_0_10px_rgba(125,211,252,0.5),0_0_20px_rgba(125,211,252,0.4),0_0_30px_rgba(192,132,252,0.25),0_0_40px_rgba(139,92,246,0.2)]">,</span>}
                    </span>
                  ))}
                </div>
                <div className="block relative mt-2">
                  {titleParts[1].split(' ').map((word, index) => (
                    <span
                      key={`line2-${word}-${index}`}
                      className="inline-block font-impact relative mr-2 sm:mr-3 md:mr-4"
                      style={{
                        fontFamily: 'Impact, "Arial Black", Arial, sans-serif',
                        fontWeight: 'normal',
                      }}
                    >
                      <motion.span
                        variants={wordVariant}
                        className="inline-block bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 bg-clip-text text-transparent dark:text-white dark:[text-shadow:0_0_10px_rgba(125,211,252,0.5),0_0_20px_rgba(125,211,252,0.4),0_0_30px_rgba(192,132,252,0.25),0_0_40px_rgba(139,92,246,0.2)] drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              headingWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="inline-block font-impact relative mr-2 sm:mr-3 md:mr-4"
                  style={{
                    fontFamily: 'Impact, "Arial Black", Arial, sans-serif',
                    fontWeight: 'normal',
                  }}
                >
                  <motion.span
                    variants={wordVariant}
                    className="inline-block bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 bg-clip-text text-transparent dark:text-white dark:[text-shadow:0_0_10px_rgba(125,211,252,0.5),0_0_20px_rgba(125,211,252,0.4),0_0_30px_rgba(192,132,252,0.25),0_0_40px_rgba(139,92,246,0.2)] drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))
            )}
          </h1>
          <motion.p
            variants={wordVariant}
            className="mx-auto mb-8 max-w-3xl text-pretty text-base text-gray-600 dark:text-slate-200 sm:mb-10 sm:text-lg md:mb-12 md:text-xl font-medium"
          >
            {displaySubtitle}
          </motion.p>
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: 0.3, ease: 'easeOut' }}
          >
            <HeroSearch />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
