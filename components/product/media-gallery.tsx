'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ZoomIn, ZoomOut, X, RotateCcw, Move } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

interface MediaGalleryProps {
  cover: string
  gallery: string[]
  title: string
}

export function MediaGallery({ cover, gallery, title }: MediaGalleryProps) {
  const t = useTranslations('product')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const images = [cover, ...gallery]
  const shouldReduceMotion = useReducedMotion()

  // 确保客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  const MIN_SCALE = 0.5
  const MAX_SCALE = 5
  const SCALE_STEP = 0.25

  // 重置缩放和位置
  const resetZoom = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  // 放大
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + SCALE_STEP, MAX_SCALE))
  }, [])

  // 缩小
  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const newScale = Math.max(prev - SCALE_STEP, MIN_SCALE)
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return newScale
    })
  }, [])

  // 处理滚轮缩放（阻止事件冒泡到页面）
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
    const newScale = Math.max(MIN_SCALE, Math.min(scale + delta, MAX_SCALE))
    setScale(newScale)
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 })
    }
  }, [scale])

  // 处理拖拽开始（鼠标）
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  // 处理拖拽移动（鼠标）
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  // 处理拖拽结束（鼠标）
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 处理触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true)
      const touch = e.touches[0]
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
    }
  }

  // 处理触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      e.preventDefault()
      const touch = e.touches[0]
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      })
    }
  }

  // 处理触摸结束
  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // 键盘快捷键
  useEffect(() => {
    if (!isZoomed) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false)
        resetZoom()
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        zoomIn()
      } else if (e.key === '-') {
        e.preventDefault()
        zoomOut()
      } else if (e.key === '0') {
        e.preventDefault()
        resetZoom()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed, resetZoom, zoomIn, zoomOut])

  // 关闭时重置
  useEffect(() => {
    if (!isZoomed) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isZoomed])

  // 阻止页面滚动（当放大视图打开时）
  useEffect(() => {
    if (isZoomed) {
      // 保存当前滚动位置
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      
      return () => {
        // 恢复页面滚动
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isZoomed])

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="glass overflow-hidden relative group cursor-zoom-in">
        <motion.div
          className="relative aspect-square"
          whileHover={shouldReduceMotion ? {} : { scale: isZoomed ? 1 : 1.05 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsZoomed(true)}
        >
          <Image
            src={images[selectedIndex] || '/placeholder.jpg'}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            quality={90}
          />
        </motion.div>
      </Card>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                selectedIndex === index
                  ? 'border-blue-500 scale-105'
                  : 'border-transparent hover:border-blue-500/50'
              }`}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              aria-label={t('viewImage', { title, index: index + 1 })}
            >
              <Image
                src={image || '/placeholder.jpg'}
                alt={`${title} - ${t('viewImage', { title, index: index + 1 })}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
                loading="lazy"
                quality={75}
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Zoom Modal - 使用 Portal 渲染到 body 下 */}
      {mounted && createPortal(
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={shouldReduceMotion ? {} : { opacity: 1 }}
              exit={shouldReduceMotion ? {} : { opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
              onClick={() => {
                setIsZoomed(false)
                resetZoom()
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={(e) => {
                // 阻止背景滚动
                e.preventDefault()
                e.stopPropagation()
              }}
              onWheelCapture={(e) => {
                // 捕获阶段也阻止
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <motion.div
                ref={imageRef}
                initial={shouldReduceMotion ? {} : { scale: 0.9 }}
                animate={shouldReduceMotion ? {} : { scale: 1 }}
                exit={shouldReduceMotion ? {} : { scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => {
                  // 只在图片容器内处理滚轮缩放
                  e.stopPropagation()
                  handleWheel(e)
                }}
                onWheelCapture={(e) => {
                  // 捕获阶段阻止冒泡
                  e.stopPropagation()
                }}
                style={{
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                }}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: '90vw',
                    height: '90vh',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                    transformOrigin: 'center center',
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  <Image
                    src={images[selectedIndex] || '/placeholder.jpg'}
                    alt={title}
                    fill
                    className="object-contain select-none"
                    sizes="90vw"
                    quality={95}
                    draggable={false}
                  />
                </div>

              {/* 控制按钮组 */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                {/* 关闭按钮 */}
                <button
                  className="p-3 rounded-full bg-gray-800/90 backdrop-blur-xl hover:bg-gray-700 border border-gray-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsZoomed(false)
                    resetZoom()
                  }}
                  aria-label={t('close')}
                  title={t('close')}
                >
                  <X className="h-5 w-5 text-white" />
                </button>

                {/* 放大按钮 */}
                <button
                  className="p-3 rounded-full bg-gray-800/90 backdrop-blur-xl hover:bg-gray-700 border border-gray-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation()
                    zoomIn()
                  }}
                  disabled={scale >= MAX_SCALE}
                  aria-label={t('zoomIn')}
                  title={`${t('zoomIn')} (${Math.round(scale * 100)}%)`}
                >
                  <ZoomIn className="h-5 w-5 text-white" />
                </button>

                {/* 缩小按钮 */}
                <button
                  className="p-3 rounded-full bg-gray-800/90 backdrop-blur-xl hover:bg-gray-700 border border-gray-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation()
                    zoomOut()
                  }}
                  disabled={scale <= MIN_SCALE}
                  aria-label={t('zoomOut')}
                  title={`${t('zoomOut')} (${Math.round(scale * 100)}%)`}
                >
                  <ZoomOut className="h-5 w-5 text-white" />
                </button>

                {/* 重置按钮 */}
                <button
                  className="p-3 rounded-full bg-gray-800/90 backdrop-blur-xl hover:bg-gray-700 border border-gray-700/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation()
                    resetZoom()
                  }}
                  disabled={scale === 1 && position.x === 0 && position.y === 0}
                  aria-label={t('resetZoom')}
                  title={`${t('resetZoom')} (0)`}
                >
                  <RotateCcw className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* 缩放比例显示 */}
              {scale !== 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white text-sm font-medium shadow-lg">
                  {Math.round(scale * 100)}%
                </div>
              )}

              {/* 提示信息 */}
              {scale === 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 text-white text-xs text-center shadow-lg max-w-md">
                  <div className="flex items-center gap-2 justify-center">
                    <Move className="h-4 w-4" />
                    <span>{t('zoomHint')}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  )
}
