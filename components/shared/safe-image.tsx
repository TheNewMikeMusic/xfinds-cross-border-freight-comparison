'use client'

import Image from 'next/image'
import { encodeImagePath } from '@/lib/image-utils'
import { useState, useMemo } from 'react'

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onError?: () => void
  [key: string]: any
}

/**
 * SafeImage - 自动处理图片路径编码的Image组件包装器
 * 解决以下问题：
 * 1. 文件名包含空格或特殊字符
 * 2. 路径编码问题
 * 3. 错误处理
 */
export function SafeImage({
  src,
  alt,
  onError,
  ...props
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  
  // 计算处理后的图片路径（使用useMemo优化性能）
  const imageSrc = useMemo(() => {
    // 如果是外部URL，直接使用
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src
    }
    
    // 处理本地路径
    // 如果路径包含空格或特殊字符，进行编码
    if (src.includes(' ') || /[^\u4e00-\u9fa5a-zA-Z0-9._/-]/.test(src)) {
      return encodeImagePath(src)
    }
    
    return src
  }, [src])

  const handleError = () => {
    setImageError(true)
    if (onError) {
      onError()
    }
  }

  // 如果图片加载失败，显示占位符
  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 ${props.className || ''}`}
        style={props.fill ? { position: 'absolute', inset: 0 } : { width: props.width, height: props.height }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">图片加载失败</span>
      </div>
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  )
}


