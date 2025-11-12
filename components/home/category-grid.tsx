'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Category, Product } from '@/lib/data'
import { useState } from 'react'

interface CategoryGridProps {
  categories: Array<Category & { productCount: number; sampleProducts: Product[] }>
  locale: string
}

export function CategoryGrid({ categories, locale }: CategoryGridProps) {
  const shouldReduceMotion = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: !shouldReduceMotion ? 0.1 : 0,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: !shouldReduceMotion ? 0.6 : 0, 
        ease: [0.34, 1.56, 0.64, 1],
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-2 max-w-6xl mx-auto sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          variants={cardVariants}
          className="w-full"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Link
            href={`/${locale}/search?cat=${category.id}`}
            className="group relative block overflow-hidden rounded-3xl focus-ring touch-manipulation active:scale-[0.98]"
          >
            {/* Liquid Glass Background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]" />
            
            {/* Animated Glass Reflection */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100"
              animate={{
                backgroundPosition: hoveredIndex === index ? ['0% 0%', '100% 100%'] : '0% 0%',
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />

            {/* Left/Right Product Images with Zoom & Crop */}
            {category.sampleProducts.length > 0 && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                <div className="grid grid-cols-2 h-full gap-px">
                  {category.sampleProducts.slice(0, 2).map((product, idx) => (
                    <motion.div
                      key={product.id}
                      className="relative overflow-hidden bg-gradient-to-br from-gray-800/30 to-gray-900/50"
                      whileHover={hoveredIndex === index ? {
                        scale: 1.05,
                        transition: { duration: 0.4, ease: 'easeOut' }
                      } : {}}
                    >
                      {product.cover && (
                        <>
                          <Image
                            src={product.cover}
                            alt=""
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:brightness-110"
                            sizes="(max-width: 640px) 50vw, 240px"
                          />
                          
                          {/* Liquid Glass Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Animated Shine Sweep */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={hoveredIndex === index ? {
                              x: ['-100%', '200%'],
                            } : { x: '-100%' }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 2,
                              ease: 'easeInOut',
                            }}
                          />
                        </>
                      )}
                      
                      {/* Glass Border Glow */}
                      <div className={`absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/60 to-transparent ${idx === 0 ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]`} />
                    </motion.div>
                  ))}
                </div>
                
                {/* Floating Glass Particles Effect */}
                {hoveredIndex === index && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/60 blur-[2px]"
                        initial={{
                          x: `${20 + i * 15}%`,
                          y: '100%',
                          opacity: 0,
                        }}
                        animate={{
                          y: '-20%',
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Category Info with Liquid Glass Effect */}
            <div className="relative p-4 text-center bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-sm rounded-b-3xl">
              {/* Glass Refraction Lines */}
              <div className="absolute inset-0 rounded-b-3xl bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3
                className={`text-sm font-bold relative z-10 transition-all duration-300 ${
                  hoveredIndex === index
                    ? 'bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 bg-clip-text text-transparent'
                    : 'text-white'
                }`}
                style={
                  hoveredIndex === index
                    ? {
                        WebkitTextFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      }
                    : undefined
                }
              >
                {category.name}
              </h3>
            </div>

            {/* Liquid Glass Edge Highlights */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating Glow Orbs */}
            <motion.div
              className="absolute top-3 right-3 w-3 h-3 rounded-full bg-cyan-400/0 blur-md"
              animate={hoveredIndex === index ? {
                backgroundColor: 'rgba(103, 232, 249, 0.4)',
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              } : {
                backgroundColor: 'rgba(103, 232, 249, 0)',
                scale: 1,
                opacity: 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-purple-400/0 blur-md"
              animate={hoveredIndex === index ? {
                backgroundColor: 'rgba(168, 85, 247, 0.4)',
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              } : {
                backgroundColor: 'rgba(168, 85, 247, 0)',
                scale: 1,
                opacity: 0,
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
