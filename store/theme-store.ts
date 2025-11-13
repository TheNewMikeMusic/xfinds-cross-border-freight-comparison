import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  getEffectiveTheme: () => 'light' | 'dark'
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system', // 默认跟随系统
      
      setTheme: (theme) => {
        set({ theme })
      },
      
      getEffectiveTheme: () => {
        const { theme } = get()
        if (theme === 'system') {
          if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          }
          return 'dark' // SSR 默认值
        }
        return theme
      },
    }),
    {
      name: 'xfinds-theme',
      skipHydration: true,
    }
  )
)

