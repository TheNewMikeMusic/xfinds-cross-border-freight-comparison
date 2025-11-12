'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { defaultLocale } from '@/i18n'
import { useTranslations } from 'next-intl'

export function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('footer')
  
  const handleLocaleChange = (locale: string) => {
    const currentPath = pathname || '/'
    const pathWithoutLocale = currentPath.replace(/^\/(zh|en)/, '') || '/'
    router.push(`/${locale}${pathWithoutLocale}`)
  }

  const currentLocale = pathname?.split('/')[1] || defaultLocale

  return (
    <footer className="mt-auto w-full border-t border-blue-600/30 bg-gray-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 space-y-3 sm:space-y-4 lg:col-span-2">
            <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Xfinds
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xs">
              {t('description')}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
          </div>

          {/* Company */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <h3 className="font-semibold text-xs sm:text-sm text-white">{t('company')}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href={`/${currentLocale}/about`} className="hover:text-blue-400 transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/contact`} className="hover:text-blue-400 transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <h3 className="font-semibold text-xs sm:text-sm text-white">{t('legal')}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href={`/${currentLocale}/legal/terms`} className="hover:text-blue-400 transition-colors">
                  {t('terms')}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/legal/privacy`} className="hover:text-blue-400 transition-colors">
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div className="col-span-2 md:col-span-1 space-y-2 sm:space-y-3 md:space-y-4">
            <h3 className="font-semibold text-xs sm:text-sm text-white">{t('quickLinks')}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href={`/${currentLocale}/agents`} className="hover:text-blue-400 transition-colors">
                  {t('agentDirectory')}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/search`} className="hover:text-blue-400 transition-colors">
                  {t('searchProducts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div className="col-span-2 md:col-span-1 flex items-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="glass border-blue-600/30 touch-manipulation w-full sm:w-auto">
                  <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{currentLocale === 'en' ? 'English' : '中文'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-blue-600/30 bg-gray-800/95 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => handleLocaleChange('zh')}>
                  中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocaleChange('en')}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-blue-600/30 text-center text-xs sm:text-sm text-gray-400">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  )
}
