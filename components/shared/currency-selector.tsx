'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCurrencyStore, CurrencyCode, SUPPORTED_CURRENCIES } from '@/store/currency-store'
import { detectCurrencyFromLocale } from '@/store/currency-store'
import { useTranslations } from 'next-intl'

interface CurrencySelectorProps {
  className?: string
  variant?: 'default' | 'compact' | 'icon'
}

export function CurrencySelector({ className, variant = 'default' }: CurrencySelectorProps) {
  const t = useTranslations('currency')
  const { selectedCurrency, setCurrency, autoDetectEnabled, shippingAddressCountry } = useCurrencyStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Auto-detect currency on mount if enabled and no shipping address
    if (autoDetectEnabled && !shippingAddressCountry) {
      const detectedCurrency = detectCurrencyFromLocale()
      if (detectedCurrency && detectedCurrency !== selectedCurrency) {
        setCurrency(detectedCurrency)
      }
    }
  }, [autoDetectEnabled, shippingAddressCountry, selectedCurrency, setCurrency])

  if (!mounted) {
    return (
      <div className={`h-9 w-24 rounded-md bg-gray-800/50 ${className || ''}`} />
    )
  }

  const currentCurrency = SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrency) || SUPPORTED_CURRENCIES[0]

  if (variant === 'icon') {
    return (
      <Select value={selectedCurrency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
        <SelectTrigger className={`h-8 w-8 min-w-[32px] p-0 rounded-full border-0 bg-transparent hover:bg-white/5 transition-colors focus-ring !justify-center [&>svg]:hidden ${className || ''}`}>
          <SelectValue className="flex items-center justify-center w-full h-full">
            <span className="font-semibold text-sm leading-none text-center text-foreground">{currentCurrency.symbol}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="glass border-white/10 dark:border-white/10 border-gray-200/50 bg-white/95 dark:bg-[#0b1024]/95 backdrop-blur-2xl max-h-[300px]">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{currency.symbol}</span>
                <span className="text-xs text-gray-400">{currency.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (variant === 'compact') {
    // Extract width and text size from className if provided
    const hasSmallWidth = className?.includes('w-12')
    const hasSmallText = className?.includes('text-[9px]')
    
    return (
      <Select value={selectedCurrency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
        <SelectTrigger className={`h-8 ${hasSmallWidth ? 'w-12' : 'w-16'} sm:w-20 border-0 bg-transparent hover:bg-white/5 transition-colors ${hasSmallText ? 'text-[9px]' : 'text-[10px]'} sm:text-xs ${className || ''}`}>
          <SelectValue>
            <span className={`font-semibold text-foreground ${hasSmallText ? 'text-[9px]' : 'text-[10px]'} sm:text-xs`}>{currentCurrency.symbol}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="glass border-white/10 dark:border-white/10 border-gray-200/50 bg-white/95 dark:bg-[#0b1024]/95 backdrop-blur-2xl max-h-[300px]">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{currency.symbol}</span>
                <span className="text-xs text-gray-400">{currency.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={selectedCurrency} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
      <SelectTrigger className={`glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white/50 dark:bg-gray-800/50 ${className || ''}`}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{currentCurrency.code}</span>
            <span className="text-sm text-gray-400">{currentCurrency.symbol}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl max-h-[400px]">
        {SUPPORTED_CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{currency.code}</span>
                <span className="text-sm text-gray-400">{currency.symbol}</span>
              </div>
              <span className="text-xs text-gray-500 ml-4">{currency.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

