'use client'

import { useState, useMemo } from 'react'
import { ProductSKUOption } from '@/lib/data'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SelectedSKU {
  [key: string]: string // e.g., { "Color": "Black", "Size": "M" }
}

interface SKUSelectorProps {
  options: ProductSKUOption[]
  value?: SelectedSKU
  onChange: (sku: SelectedSKU) => void
  className?: string
}

export function SKUSelector({ options, value = {}, onChange, className }: SKUSelectorProps) {
  const t = useTranslations('product')
  
  const handleOptionChange = (optionName: string, optionValue: string) => {
    const newSKU = {
      ...value,
      [optionName]: optionValue,
    }
    onChange(newSKU)
  }

  // Check if all required options are selected
  const isComplete = useMemo(() => {
    return options.every((option) => value[option.name])
  }, [options, value])

  if (options.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      {options.map((option) => {
        const selectedValue = value[option.name] || ''
        
        return (
          <div key={option.name} className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-gray-300">
              {option.name}:
              {selectedValue && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">{selectedValue}</span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {option.values.map((val) => {
                const isSelected = selectedValue === val
                return (
                  <Button
                    key={val}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleOptionChange(option.name, val)}
                    className={cn(
                      'transition-all',
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-500 border-blue-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-100 dark:bg-gray-800/50'
                    )}
                  >
                    {val}
                  </Button>
                )
              })}
            </div>
          </div>
        )
      })}
      {!isComplete && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          {t('pleaseSelectAllOptions')}
        </p>
      )}
    </div>
  )
}

