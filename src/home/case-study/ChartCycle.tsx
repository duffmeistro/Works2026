import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks'
import { ArtifactChart, type ChartType } from './ArtifactChart'
import { useLive } from './primitives'
import s from './ChartCycle.module.css'

const CHARTS: ChartType[] = ['stacked', 'gauge', 'allocation']

export function ChartCycle({ hold = 11.5 }: { hold?: number }) {
  const [ref, live] = useLive<HTMLDivElement>()
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % CHARTS.length), Math.max(9, hold) * 1000)
    return () => window.clearInterval(id)
  }, [live, hold])

  const chart = CHARTS[index]

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Breeze Assistant dark mode, cycling through the stacked bars, gauge and split bars artifacts"
      className={s.root}
    >
      <div key={chart} className={s.cyc}>
        <ArtifactChart chart={chart} theme="dark" live={live} still={reduceMotion} decorative />
      </div>
    </div>
  )
}
