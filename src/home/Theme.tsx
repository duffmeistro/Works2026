import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'hm-theme'

type ThemeValue = {
  dark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

function readStored(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dark'
  } catch {
    return false
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(readStored)

  useEffect(() => {
    document.body.classList.toggle('is-dark', dark)
    try {
      window.localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    } catch {
      return
    }
  }, [dark])

  const toggle = useCallback(() => setDark((d) => !d), [])
  const value = useMemo(() => ({ dark, toggle }), [dark, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
