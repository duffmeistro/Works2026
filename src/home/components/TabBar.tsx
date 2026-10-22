import { useElementWidth, useMediaQuery } from '../hooks'
import { projects } from '../projects'
import { TabIcon } from './TabIcons'

type TabBarProps = {
  active: number
  onPick: (index: number) => void
}

const ICON = 22
const GAP = 8
const PAD = 6
const LABEL = 'Projects'

export function TabBar({ active, onPick }: TabBarProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [barRef, barWidth] = useElementWidth<HTMLElement>(isMobile ? 354 : 440)

  const side = isMobile ? 14 : 16
  const charWidth = isMobile ? 6.8 : 7.3
  const labels = projects.map((p) => (isMobile ? p.tabShort : p.tab))
  const labelWidth = Math.ceil(labels[active].length * charWidth) + 2
  const activeWidth = 2 * side + ICON + GAP + labelWidth
  const idleWidth = (barWidth - 2 * PAD - activeWidth) / (projects.length - 1)
  const indicatorLeft = active * idleWidth

  return (
    <nav ref={barRef} className="hm-tabbar hm-hip" aria-label="Projects">
      <span className={active === 0 ? 'hm-projlbl' : 'hm-projlbl is-off'} aria-hidden="true">
        {LABEL.split('').map((ch, i) => (
          <span key={i} className="hm-projlbl__ch" style={{ animationDelay: `${(i * 0.05).toFixed(2)}s` }}>
            {ch}
          </span>
        ))}
      </span>
      <div className="hm-tabbar__track">
        <div className="hm-ind" style={{ width: activeWidth, transform: `translateX(${indicatorLeft}px)` }} />
        {projects.map((p, i) => {
          const on = i === active
          return (
            <button
              key={p.slug}
              type="button"
              className={on ? 'hm-seg is-on' : 'hm-seg'}
              style={{ width: on ? activeWidth : idleWidth }}
              aria-pressed={on}
              aria-label={i === 0 ? 'Show About' : `Show project ${i}: ${p.homeName}`}
              onClick={() => onPick(i)}
            >
              <TabIcon slug={p.slug} />
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
