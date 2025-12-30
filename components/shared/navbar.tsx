'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, LogOut, ArrowLeft, Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { CurrencySelector } from '@/components/shared/currency-selector'
import { useExchangeRates } from '@/hooks/use-currency'
import { useThemeStore } from '@/store/theme-store'

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isDesktopSearchFocused, setIsDesktopSearchFocused] = useState(false)
  const [hasNewCartItem, setHasNewCartItem] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const locale = (params?.locale as string) || 'en'
  const t = useTranslations('nav')
  const { theme, setTheme } = useThemeStore()
  
  // Check if we're on the home page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`
  const [cartItemCount, setCartItemCount] = useState(0)
  const previousCartCount = useRef(0)
  
  // Initialize exchange rates
  useExchangeRates()
  
  // Only access store after mount to prevent SSR mismatch
  useEffect(() => {
    setMounted(true)
    // Rehydrate cart store
    useCartStore.persist.rehydrate()
    // Get cart count after rehydration
    const updateCartCount = () => {
      setCartItemCount(useCartStore.getState().getItemCount())
    }
    updateCartCount()
    // Subscribe to cart changes
    const unsubscribe = useCartStore.subscribe(updateCartCount)
    return unsubscribe
  }, [])
  
  // Initialize previousCartCount after mount
  useEffect(() => {
    if (mounted) {
      previousCartCount.current = cartItemCount
    }
  }, [mounted, cartItemCount])

  useEffect(() => {
    if (!mounted) return
    fetch('/api/auth')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch auth status')
        }
        return res.json()
      })
      .then((data) => setUser(data.user))
      .catch((error) => {
        console.error('Failed to fetch auth status:', error)
        setUser(null)
      })
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    let timeout: NodeJS.Timeout | null = null
    if (cartItemCount > previousCartCount.current) {
      setHasNewCartItem(true)
      timeout = setTimeout(() => setHasNewCartItem(false), 1500)
    }
    previousCartCount.current = cartItemCount
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [cartItemCount, mounted])

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    })
    setUser(null)
    router.push(`/${locale}`)
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      case 'system':
        return <Monitor className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-500',
        'border-white/5 dark:border-white/5 border-gray-200/50',
        mounted && scrolled
          ? 'bg-white/90 dark:bg-[#050916]/90 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(5,8,19,0.85)] backdrop-blur-3xl'
          : 'bg-transparent backdrop-blur-xl'
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-3 sm:px-4 sm:h-16 md:grid md:grid-cols-3 md:justify-items-stretch">
        {/* Back Button & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-shrink-0 overflow-hidden md:col-start-1">
          {!isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/${locale}`)}
              className="focus-ring touch-manipulation h-9 w-9 sm:min-h-[40px] sm:min-w-[40px] flex-shrink-0 p-0"
              aria-label="Go back to home"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-sky-200" aria-hidden="true" />
            </Button>
          )}
          <Link
            href={`/${locale}`}
            aria-label="Xfinds home"
            className={cn(
              "focus-ring flex items-center transition-all duration-300 hover:opacity-80 active:scale-95 touch-manipulation flex-shrink-0",
              !isHomePage && "max-w-[70px] sm:max-w-none"
            )}
          >
            <div className={cn(
              "relative w-auto flex-shrink-0",
              !isHomePage ? "h-5 sm:h-8" : "h-8"
            )}>
              <Image
                src="/Xfinds logo2.png"
                alt="Xfinds logo"
                width={96}
                height={32}
                className={cn(
                  "object-contain w-auto",
                  !isHomePage ? "h-5 sm:h-8" : "h-8"
                )}
                priority
              />
            </div>
          </Link>
        </div>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex justify-center items-center md:col-start-2 px-4 w-full">
          <div
            className={cn(
              'group relative w-full max-w-md rounded-full border transition-all duration-300',
              'border-white/5 dark:border-white/5 border-gray-200/50 dark:border-gray-200/50',
              'bg-white/5 dark:bg-white/5 bg-gray-50/50',
              'focus-within:border-lime-300/80 dark:focus-within:border-lime-300/80 focus-within:border-blue-500/60',
              'focus-within:shadow-[0_0_50px_rgba(94,243,140,0.35)] dark:focus-within:shadow-[0_0_50px_rgba(94,243,140,0.35)] focus-within:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
              isDesktopSearchFocused && 'border-lime-200/80 dark:border-lime-200/80 border-blue-500/60 shadow-[0_0_50px_rgba(94,243,140,0.35)] dark:shadow-[0_0_50px_rgba(94,243,140,0.35)] shadow-[0_0_30px_rgba(59,130,246,0.2)]'
            )}
          >
            <Input
              type="text"
              aria-label={t('searchPlaceholder')}
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onFocus={() => setIsDesktopSearchFocused(true)}
              onBlur={() => setIsDesktopSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-none bg-transparent pl-12 pr-4 py-2 font-mono text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-lime-200 dark:group-focus-within:text-lime-200 group-focus-within:text-blue-500"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0 md:col-start-3 md:justify-end">
          {/* Currency Selector */}
          <CurrencySelector variant="icon" />
          
          {/* Theme Toggle - Desktop Only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden md:flex focus-ring touch-manipulation"
            aria-label={t('toggleTheme')}
            title={theme === 'light' ? t('lightMode') : theme === 'dark' ? t('darkMode') : t('systemMode')}
          >
            {getThemeIcon()}
          </Button>
          
          {/* Mobile Search */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden focus-ring touch-manipulation" 
                aria-label={t('searchPlaceholder')}
                type="button"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="glass border-white/10 dark:border-white/10 border-gray-200/50 bg-white/95 dark:bg-[#01060a]/95 backdrop-blur-3xl"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">{t('searchPlaceholder')}</SheetTitle>
                <SheetDescription className="sr-only">
                  Search for products across our platform
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSearch} className="mt-6 space-y-3">
                <label htmlFor="mobile-search-input" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t('searchPlaceholder')}
                </label>
                <div className="relative">
                  <Input
                    id="mobile-search-input"
                    type="text"
                    aria-label={t('searchPlaceholder')}
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border-white/10 dark:border-white/10 border-gray-200/50 bg-white/5 dark:bg-white/5 bg-gray-50/50 pl-12 pr-4 py-3 font-mono text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-lime-300/40 dark:focus-visible:ring-lime-300/40 focus-visible:ring-blue-500/40"
                    autoFocus
                  />
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </form>
            </SheetContent>
          </Sheet>

          {/* Cart */}
          <div className="relative">
            <Button variant="ghost" size="icon" asChild className="relative !overflow-visible focus-ring touch-manipulation" aria-live="polite">
              <Link href={`/${locale}/cart`} className="relative !overflow-visible touch-manipulation">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{t('cart')}</span>
              </Link>
            </Button>
            {mounted && cartItemCount > 0 && (
              <span
                className={cn(
                  'absolute top-0 right-0 z-20 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-gradient-to-br from-lime-300 to-cyan-400 px-1 text-[10px] font-bold leading-none text-gray-900 shadow-[0_2px_8px_rgba(94,243,140,0.4)] pointer-events-none',
                  cartItemCount > 9 && 'px-0.5',
                  hasNewCartItem && 'badge-pulse'
                )}
                aria-label={`${cartItemCount} items in cart`}
              >
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="focus-ring touch-manipulation">
                <User className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{t('userMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10 dark:border-white/10 border-gray-200/50 bg-white/95 dark:bg-[#0b1024]/95 backdrop-blur-2xl">
              {user ? (
                <>
                  <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/auth/login`}>{t('login')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/auth/register`}>{t('register')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => setTheme('light')} className={cn(theme === 'light' && 'bg-accent')}>
                <Sun className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('lightMode')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className={cn(theme === 'dark' && 'bg-accent')}>
                <Moon className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('darkMode')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className={cn(theme === 'system' && 'bg-accent')}>
                <Monitor className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('systemMode')}
              </DropdownMenuItem>
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('logout')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
