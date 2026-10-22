import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks'

const LOADER_TEXT = 'Gavan Duffy _ Product Designer'

let shownThisLoad = false

export function Loader() {
  const [visible, setVisible] = useState(() => !shownThisLoad)
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
