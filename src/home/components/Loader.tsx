import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks'

let shownThisLoad = false

export function Loader() {
  const [visible, setVisible] = useState(() => !shownThisLoad)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!visible) return
    shownThisLoad = true
    const t = window.setTimeout(() => setVisible(false), reduceMotion ? 1000 : 2200)
    return () => window.clearTimeout(t)
  }, [visible, reduceMotion])

  if (!visible) return null
  return (
    <div className="hm-loader" aria-hidden="true">
      <span>Gavan Duffy_Product Designer</span>
    </div>
  )
}
