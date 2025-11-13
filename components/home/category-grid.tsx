'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Category, Product } from '@/lib/data'

interface CategoryGridProps {
  categories: Array<Category & { productCount: number; sampleProducts: Product[] }>
  locale: string
}

export function CategoryGrid({ categories, locale }: CategoryGridProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: !shouldReduceMotion ? 0.03 : 0,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: !shouldReduceMotion ? 0.3 : 0, 
        ease: 'easeOut',
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
        >
          <Link
            href={`/${locale}/search?cat=${category.id}`}
            className="group relative block overflow-hidden rounded-3xl focus-ring touch-manipulation active:scale-[0.98]"
          >
            {/* Liquid Glass Background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] dark:from-white/[0.08] dark:via-white/[0.04] dark:to-white/[0.02] backdrop-blur-xl border border-white/20 dark:border-white/20 border-gray-200/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]" />
            
            {/* Glass Reflection */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Left/Right Product Images with Zoom & Crop */}
            {category.sampleProducts.length > 0 && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                <div className="grid grid-cols-2 h-full gap-px">
                  {category.sampleProducts.slice(0, 2).map((product, idx) => (
                      <div
                        key={product.id}
                        className="relative overflow-hidden bg-gradient-to-br from-gray-800/30 to-gray-900/50"
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
                          
                        </>
                      )}
                      
                      {/* Glass Border Glow */}
                      <div className={`absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/60 to-transparent ${idx === 0 ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]`} />
                    </div>
                  ))}
                </div>
                
              </div>
            )}

            {/* Category Info with Liquid Glass Effect */}
            <div className="relative p-4 text-center bg-gradient-to-t from-white/95 via-white/80 to-transparent dark:from-black/60 dark:via-black/40 dark:to-transparent backdrop-blur-sm rounded-b-3xl">
              {/* Glass Refraction Lines */}
              <div className="absolute inset-0 rounded-b-3xl bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="text-sm font-bold relative z-10 text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-200">
                {category.name}
              </h3>
            </div>

            {/* Liquid Glass Edge Highlights */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
