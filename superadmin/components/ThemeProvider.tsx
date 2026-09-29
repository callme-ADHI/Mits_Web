'use client'

import React, { createContext, useContext, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback)
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', callback)
  return () => {
    window.removeEventListener('storage', callback)
    media.removeEventListener('change', callback)
  }
}

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('mits_superadmin_theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getServerThemeSnapshot(): Theme {
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot)

  function setTheme(newTheme: Theme) {
    localStorage.setItem('mits_superadmin_theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    window.dispatchEvent(new Event('storage'))
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
