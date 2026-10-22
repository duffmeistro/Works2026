import type { CSSProperties } from 'react'
import { useElementWidth, useMediaQuery } from '../hooks'
import { projects } from '../projects'

type TabBarProps = {
  active: number
  onPick: (index: number) => void
}

const ICON = 22
const GAP = 8
const PAD = 6

export function TabBar({ active, onPick }: TabBarProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [barRef, barWidth] = useElementWidth<HTMLElement>(isMobile ? 354 : 520)

  const side = isMobile ? 14 : 18
  const charWidth = isMobile ? 6.8 : 7.3
  const labels = projects.map((p) => (isMobile ? p.tabM : p.tab))
  const labelWidth = Math.ceil(labels[active].length * charWidth) + 2
  const activeWidth = 2 * side + ICON + GAP + labelWidth
  const idleWidth = (barWidth - 2 * PAD - activeWidth) / (projects.length - 1)

  let indicatorLeft = 0
  projects.forEach((_, i) => {
    if (i < active) indicatorLeft += idleWidth
  })

  return (
    <nav ref={barRef} className="hm-tabbar hm-hip" aria-label="Projects">
      <span className="hm-tabbar__title" aria-hidden="true">
        Projects
      </span>
      <div className="hm-tabbar__track">
        <div
          className="hm-ind"
          style={{ width: activeWidth, transform: `translateX(${indicatorLeft}px)` }}
        />
        {projects.map((p, i) => {
          const on = i === active
          return (
            <button
              key={p.slug}
              type="button"
              className={on ? 'hm-seg is-on' : 'hm-seg'}
              style={{ width: on ? activeWidth : idleWidth }}
              aria-pressed={on}
              aria-label={`Show project ${i + 1}: ${p.name}`}
              onClick={() => onPick(i)}
            >
              <span className="hm-orb" aria-hidden="true">
                <span
                  className="hm-orb__swirl"
                  style={{
                    background: `conic-gradient(from 0deg, ${p.accent} 0%, #FFFFFF 22%, ${p.accent} 42%, ${p.bg} 64%, ${p.accent} 82%, #FFFFFF 100%)`,
                  }}
                />
                <span
                  className="hm-orb__swirl hm-orb__swirl--2"
                  style={
                    {
                      background: `conic-gradient(from 140deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 18%, rgba(255,255,255,0) 36%, ${p.accent} 58%, rgba(255,255,255,0) 78%, rgba(255,255,255,0.6) 90%, rgba(255,255,255,0) 100%)`,
                    } as CSSProperties
                  }
                />
                <span className="hm-orb__gloss" />
              </span>
              <span className="hm-seg__label" style={{ width: on ? labelWidth + GAP : 0 }}>
                {labels[i]}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
