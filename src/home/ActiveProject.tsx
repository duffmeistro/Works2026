import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { projects } from './projects'

type ActiveProjectValue = {
  active: number
  setActive: (index: number) => void
  step: (delta: number) => void
}

const ActiveProjectContext = createContext<ActiveProjectValue | null>(null)

export function ActiveProjectProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState(0)
  const count = projects.length

  const setActive = useCallback(
    (index: number) => setActiveState(((index % count) + count) % count),
    [count],
  )
  const step = useCallback(
    (delta: number) => setActiveState((i) => (((i + delta) % count) + count) % count),
    [count],
  )

  const value = useMemo(() => ({ active, setActive, step }), [active, setActive, step])
  return <ActiveProjectContext.Provider value={value}>{children}</ActiveProjectContext.Provider>
}

export function useActiveProject() {
  const ctx = useContext(ActiveProjectContext)
  if (!ctx) throw new Error('useActiveProject must be used inside ActiveProjectProvider')
  return ctx
}
