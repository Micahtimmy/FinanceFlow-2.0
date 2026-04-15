import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Theme } from '@/types'

export type FontFamily = 'system' | 'inter' | 'roboto' | 'nunito' | 'source-sans'
export type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'rose' | 'slate'
export type DashboardDensity = 'comfortable' | 'compact'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  font: FontFamily
  setFont: (font: FontFamily) => void
  accentColor: AccentColor
  setAccentColor: (color: AccentColor) => void
  density: DashboardDensity
  setDensity: (density: DashboardDensity) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'financeflow-theme'
const FONT_STORAGE_KEY = 'financeflow-font'
const ACCENT_STORAGE_KEY = 'financeflow-accent'
const DENSITY_STORAGE_KEY = 'financeflow-density'

const accentColorValues: Record<AccentColor, { primary: string; secondary: string; tertiary: string }> = {
  blue: { primary: '#6366f1', secondary: '#818cf8', tertiary: '#a5b4fc' },
  purple: { primary: '#a855f7', secondary: '#c084fc', tertiary: '#d8b4fe' },
  green: { primary: '#10b981', secondary: '#34d399', tertiary: '#6ee7b7' },
  orange: { primary: '#f59e0b', secondary: '#fbbf24', tertiary: '#fcd34d' },
  rose: { primary: '#f43f5e', secondary: '#fb7185', tertiary: '#fda4af' },
  slate: { primary: '#64748b', secondary: '#94a3b8', tertiary: '#cbd5e1' },
}

const fontFamilyValues: Record<FontFamily, string> = {
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  inter: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  roboto: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
  nunito: '"Nunito", -apple-system, BlinkMacSystemFont, sans-serif',
  'source-sans': '"Source Sans Pro", -apple-system, BlinkMacSystemFont, sans-serif',
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    return stored || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'system') return getSystemTheme()
    return theme
  })

  const [font, setFontState] = useState<FontFamily>(() => {
    if (typeof window === 'undefined') return 'system'
    const stored = localStorage.getItem(FONT_STORAGE_KEY) as FontFamily | null
    return stored || 'system'
  })

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    if (typeof window === 'undefined') return 'blue'
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor | null
    return stored || 'blue'
  })

  const [density, setDensityState] = useState<DashboardDensity>(() => {
    if (typeof window === 'undefined') return 'comfortable'
    const stored = localStorage.getItem(DENSITY_STORAGE_KEY) as DashboardDensity | null
    return stored || 'comfortable'
  })

  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    document.documentElement.setAttribute('data-theme', resolved)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light'
      setResolvedTheme(newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  // Apply font family
  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', fontFamilyValues[font])
  }, [font])

  // Apply accent color
  useEffect(() => {
    const colors = accentColorValues[accentColor]
    document.documentElement.style.setProperty('--color-accent', colors.primary)
    document.documentElement.style.setProperty('--color-accent-2', colors.secondary)
    document.documentElement.style.setProperty('--color-accent-3', colors.tertiary)
  }, [accentColor])

  // Apply density
  useEffect(() => {
    document.documentElement.setAttribute('data-density', density)
  }, [density])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
  }

  const setFont = (newFont: FontFamily) => {
    setFontState(newFont)
    localStorage.setItem(FONT_STORAGE_KEY, newFont)
  }

  const setAccentColor = (newColor: AccentColor) => {
    setAccentColorState(newColor)
    localStorage.setItem(ACCENT_STORAGE_KEY, newColor)
  }

  const setDensity = (newDensity: DashboardDensity) => {
    setDensityState(newDensity)
    localStorage.setItem(DENSITY_STORAGE_KEY, newDensity)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        font,
        setFont,
        accentColor,
        setAccentColor,
        density,
        setDensity,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
