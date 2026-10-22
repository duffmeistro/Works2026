import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks'

const LOADER_TEXT = 'Gavan Duffy _ Product Designer'

const LOADER_FADE_AT_MS = 1800
const INTRO_LEAD_MS = 150

let shownThisLoad = false
let startedAt: number | null = null

export function introDelayMs(): number {
  if (startedAt === null) return 0
  return Math.max(0, startedAt + LOADER_FADE_AT_MS - INTRO_LEAD_MS - performance.now())
}

export function Loader() {
  const [visible, setVisible] = useState(() => {
    if (shownThisLoad) return false
    startedAt ??= performance.now()
    return true
  })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!visible) return
    shownThisLoad = true
    const t = window.setTimeout(() => setVisible(false), reduceMotion ? 1000 : 2500)
    return () => window.clearTimeout(t)
  }, [visible, reduceMotion])

  if (!visible) return null
  return (
    <div className="hm-loader" aria-hidden="true">
      <span className="hm-loader__text">
        {LOADER_TEXT.split('').map((ch, i) => (
          <span key={i} className="hm-loader__ch" style={{ animationDelay: `${(0.15 + i * 0.025).toFixed(3)}s` }}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </span>
    </div>
  )
}
