'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'

interface SortDropdownProps {
  value: 'relevance' | 'price' | 'new'
  onValueChange: (value: 'relevance' | 'price' | 'new') => void
}

export function SortDropdown({ value, onValueChange }: SortDropdownProps) {
  const t = useTranslations('search')

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:bg-gray-800/50 backdrop-blur-xl">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="glass border-blue-600/30 dark:border-blue-600/30 border-blue-500/30 bg-white dark:bg-gray-800/95 backdrop-blur-xl">
        <SelectItem value="relevance">{t('sortRelevance')}</SelectItem>
        <SelectItem value="price">{t('sortPrice')}</SelectItem>
        <SelectItem value="new">{t('sortNew')}</SelectItem>
      </SelectContent>
    </Select>
  )
}
