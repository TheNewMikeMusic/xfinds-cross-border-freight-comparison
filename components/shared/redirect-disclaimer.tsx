'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslations } from 'next-intl'

interface RedirectDisclaimerProps {
  open: boolean
  onContinue: () => void
  onCancel: () => void
}

const STORAGE_KEY = 'xfinds-redirect-disclaimer-dismissed'

export function RedirectDisclaimer({
  open,
  onContinue,
  onCancel,
}: RedirectDisclaimerProps) {
  const t = useTranslations('redirect')
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleContinue = () => {
    if (dontShowAgain) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY, 'true')
        }
      } catch (error) {
        console.error('Failed to save preference:', error)
      }
    }
    onContinue()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="glass border-gray-300 dark:border-blue-600/30 bg-white dark:bg-gray-900/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-gray-900 dark:text-white">
            {t('title')}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-700 dark:text-gray-300 pt-2">
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <Checkbox
            id="dont-show-again"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            className="border-gray-400 dark:border-blue-600/30"
          />
          <label
            htmlFor="dont-show-again"
            className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            {t('dontShowAgain')}
          </label>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleContinue}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
          >
            {t('continue')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Check if user has dismissed the disclaimer
 */
export function hasSeenRedirectDisclaimer(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

