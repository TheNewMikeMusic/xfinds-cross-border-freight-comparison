'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface FilterChipsProps {
  filters: {
    categoryId?: string
    agentId?: string
    minPrice?: number
    maxPrice?: number
  }
  categories: Array<{ id: string; name: string }>
  agents: Array<{ id: string; name: string }>
  onRemove: (type: 'category' | 'agent' | 'price') => void
}

export function FilterChips({
  filters,
  categories,
  agents,
  onRemove,
}: FilterChipsProps) {
  const t = useTranslations('search')
  const chips: Array<{ type: 'category' | 'agent' | 'price'; label: string }> =
    []

  if (filters.categoryId) {
    const category = categories.find((c) => c.id === filters.categoryId)
    if (category) {
      chips.push({ type: 'category', label: category.name })
    }
  }

  if (filters.agentId) {
    const agent = agents.find((a) => a.id === filters.agentId)
    if (agent) {
      chips.push({ type: 'agent', label: agent.name })
    }
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const priceLabel =
      filters.minPrice !== undefined && filters.maxPrice !== undefined
        ? `¥${filters.minPrice} - ¥${filters.maxPrice}`
        : filters.minPrice !== undefined
          ? `¥${filters.minPrice}+`
          : `¥${filters.maxPrice}-`
    chips.push({ type: 'price', label: priceLabel })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1 rounded-full glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-xl"
        >
          <span className="text-sm">{chip.label}</span>
          <button
            onClick={() => onRemove(chip.type)}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label={`${t('remove')} ${chip.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
