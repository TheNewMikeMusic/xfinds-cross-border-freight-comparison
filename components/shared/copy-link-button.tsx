'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard } from '@/lib/agent-utils'
import { useTranslations } from 'next-intl'
import { toast } from '@/hooks/use-toast'

interface CopyLinkButtonProps {
  url: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  ariaLabel?: string
  title?: string
}

export function CopyLinkButton({
  url,
  variant = 'outline',
  size = 'default',
  className = '',
  ariaLabel,
  title,
}: CopyLinkButtonProps) {
  const t = useTranslations('agent')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await copyToClipboard(url)
      setCopied(true)
      toast({
        title: t('linkCopied'),
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: t('copyFailed') || 'Failed to copy link',
        variant: 'destructive',
        duration: 2000,
      })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      aria-label={ariaLabel || t('copyLink')}
      title={title || t('copyLink')}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          {size !== 'icon' && (t('copied') || 'Copied')}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-2" />
          {size !== 'icon' && t('copyLink')}
        </>
      )}
    </Button>
  )
}

