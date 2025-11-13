'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/store/theme-store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, getEffectiveTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // 确保在客户端执行
    if (typeof window === 'undefined') return

    // 等待 store 初始化
    useThemeStore.persist.rehydrate()
    
    const root = document.documentElement
    const effectiveTheme = getEffectiveTheme()

    // 移除所有主题类
    root.classList.remove('light', 'dark')
    
    // 添加当前有效主题类
    root.classList.add(effectiveTheme)

    // 如果使用系统主题，监听系统主题变化
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
      }

      // 初始设置
      handleChange(mediaQuery)

      // 监听变化
      mediaQuery.addEventListener('change', handleChange)
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }, [theme, getEffectiveTheme])

  // 主题变化时更新
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    
    const root = document.documentElement
    const effectiveTheme = getEffectiveTheme()
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
  }, [mounted, theme, getEffectiveTheme])

  // 防止闪烁
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}

