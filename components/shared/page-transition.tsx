'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(true)
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    // 只在路径真正改变时触发动画
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      // 页面切换时重置可见性状态
      setIsVisible(false)
      // 使用 requestAnimationFrame 确保 DOM 更新后再触发动画
      const timer = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
      return () => cancelAnimationFrame(timer)
    }
  }, [pathname])

  if (shouldReduceMotion) {
    return <div className="min-h-screen page-transition-container">{children}</div>
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="min-h-screen page-transition-container"
      style={{
        willChange: 'opacity',
      }}
    >
      {children}
    </motion.div>
  )
}
