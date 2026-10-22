import type { CSSProperties } from 'react'
import { layerState } from '../layerState'
import { projects, type Image, type Stage as StageConfig } from '../projects'

function Phone({ side, screen }: { side: 'l' | 'r' | 'c'; screen: Image }) {
  return (
    <div className={`hm-dev-pos hm-dev-pos--${side}`}>
      <div className={`hm-phone hm-phone--${side}`}>
        <div className="hm-phone__screen">
          <img className="hm-screen__img" src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} decoding="async" />
          <span className="hm-phone__island" />
        </div>
      </div>
    </div>
  )
}

function Monitor({ screen }: { screen: Image }) {
  return (
    <div className="hm-dev-pos hm-dev-pos--d">
      <div className="hm-monitor-3d">
        <div className="hm-monitor">
          <div className="hm-monitor__screen">
            <img src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} decoding="async" />
          </div>
        </div>
        <div className="hm-monitor__neck" />
        <div className="hm-monitor__foot" />
      </div>
    </div>
  )
}

function Devices({ stage }: { stage: StageConfig }) {
  switch (stage.kind) {
    case 'angled':
    case 'pair':
      return (
        <>
          <Phone side="l" screen={stage.screens[0]} />
          <Phone side="r" screen={stage.screens[1]} />
        </>
      )
    case 'solo':
      return <Phone side="c" screen={stage.screen} />
    case 'monitor':
      return <Monitor screen={stage.screen} />
    default:
      return null
  }
}

export function Stage({ active, scale }: { active: number; scale: number }) {
  return (
    <div className="hm-stage hm-hip" aria-hidden="true" style={{ '--stage-scale': scale.toFixed(3) } as CSSProperties}>
      {projects.map((p, i) => (
        <div
          key={p.slug}
          className={`hm-layer hm-layer--${p.stage.kind} is-${layerState(i, active)}`}
        >
          <Devices stage={p.stage} />
        </div>
      ))}
    </div>
  )
}
