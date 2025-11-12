'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Category, Agent } from '@/lib/data'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { FloatingInput } from '@/components/ui/floating-input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

interface FiltersPanelProps {
  categories: Category[]
  agents: Agent[]
  mobile?: boolean
}

export function FiltersPanel({
  categories,
  agents,
  mobile = false,
}: FiltersPanelProps) {
  const t = useTranslations('search')
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  
  // Initialize state with consistent defaults to prevent hydration mismatch
  const [categoryId, setCategoryId] = useState<string>('all')
  const [agentId, setAgentId] = useState<string>('all')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [priceTouched, setPriceTouched] = useState({ min: false, max: false })

  useEffect(() => {
    if (searchParams) {
      const cat = searchParams.get('cat') || 'all'
      const agent = searchParams.get('agent') || 'all'
      const min = searchParams.get('minPrice') || ''
      const max = searchParams.get('maxPrice') || ''
      
      setCategoryId(cat)
      setAgentId(agent)
      setMinPrice(min)
      setMaxPrice(max)
    }
  }, [searchParams])

  const updateUrl = (updates: Record<string, string | null>) => {
    if (!searchParams) return
    const urlParams = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        urlParams.delete(key)
      } else {
        urlParams.set(key, value)
      }
    })
    router.push(`/${locale}/search?${urlParams.toString()}`)
  }

  const hasPriceRange = minPrice !== '' || maxPrice !== ''
  const minValue = Number(minPrice)
  const maxValue = Number(maxPrice)
  const priceRangeInvalid =
    minPrice !== '' && maxPrice !== '' && !Number.isNaN(minValue) && !Number.isNaN(maxValue) && minValue > maxValue
  const priceError = priceRangeInvalid ? t('priceRangeError') : ''
  const priceHint = priceError ? undefined : t('priceRangeHint')

  const filtersContent = (
    <div className="space-y-4 text-white">
        <div className="space-y-2">
          <p className="text-sm text-gray-300">{t('category')}</p>
          <Select
            value={categoryId || 'all'}
            onValueChange={(value) => {
              const newValue = value === 'all' ? 'all' : value
              setCategoryId(newValue)
              updateUrl({ cat: value === 'all' ? null : value })
            }}
          >
            <SelectTrigger
              id="category"
              aria-label={t('category')}
              className="glass w-full rounded-2xl border-blue-600/30 bg-gray-900/70 text-left text-white"
            >
              <SelectValue placeholder={t('selectCategory')} className="text-white" />
            </SelectTrigger>
            <SelectContent className="glass border-blue-600/40 bg-gray-900/95 text-white">
              <SelectItem value="all" className="text-white">{t('all')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="capitalize text-white">
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-300">{t('agent')}</p>
          <Select
            value={agentId || 'all'}
            onValueChange={(value) => {
              const newValue = value === 'all' ? 'all' : value
              setAgentId(newValue)
              updateUrl({ agent: value === 'all' ? null : value })
            }}
          >
            <SelectTrigger
              id="agent"
              aria-label={t('agent')}
              className="glass w-full rounded-2xl border-blue-600/30 bg-gray-900/70 text-left text-white"
            >
              <SelectValue placeholder={t('selectAgent')} className="text-white" />
            </SelectTrigger>
            <SelectContent className="glass border-blue-600/40 bg-gray-900/95 text-white">
              <SelectItem value="all" className="text-white">{t('all')}</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id} className="text-white">
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-300">{t('priceRange')}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FloatingInput
              id="minPrice"
              label={t('minPrice')}
              type="number"
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value)
                updateUrl({ minPrice: e.target.value || null })
              }}
              onBlur={() => setPriceTouched((prev) => ({ ...prev, min: true }))}
              state={
                priceError && (priceTouched.min || priceTouched.max)
                  ? 'error'
                  : minPrice
                  ? 'success'
                  : 'default'
              }
              error={
                priceError && (priceTouched.min || priceTouched.max)
                  ? priceError
                  : ''
              }
              hint={!hasPriceRange ? priceHint : undefined}
            />
            <FloatingInput
              id="maxPrice"
              label={t('maxPrice')}
              type="number"
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
                updateUrl({ maxPrice: e.target.value || null })
              }}
              onBlur={() => setPriceTouched((prev) => ({ ...prev, max: true }))}
              state={
                priceError && (priceTouched.min || priceTouched.max)
                  ? 'error'
                  : maxPrice
                  ? 'success'
                  : 'default'
              }
              error={
                priceError && (priceTouched.min || priceTouched.max)
                  ? priceError
                  : ''
              }
              hint={hasPriceRange && !priceError ? priceHint : undefined}
            />
          </div>
        </div>
    </div>
  )

  if (mobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full glass border-blue-600/30 bg-gray-900/80 touch-manipulation">
            <Filter className="h-4 w-4 mr-2" />
            {t('filters')}
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="!bg-[#0b1024] border-white/10 backdrop-blur-2xl w-[85vw] sm:w-[400px] overflow-y-auto"
        >
          <SheetHeader className="relative z-10 mb-6">
            <SheetTitle className="text-white">{t('filters')}</SheetTitle>
            <SheetDescription className="text-gray-400">
              Filter products by category, agent, and price range
            </SheetDescription>
          </SheetHeader>
          <div className="relative z-10">
            {filtersContent}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Card className="glass border-blue-600/30 bg-gray-900/80 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
      <CardHeader>
        <CardTitle>{t('filters')}</CardTitle>
      </CardHeader>
      <CardContent>
        {filtersContent}
      </CardContent>
    </Card>
  )
}
