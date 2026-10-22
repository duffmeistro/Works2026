import type { CSSProperties } from 'react'
import { layerState } from '../layerState'
import { projects, type Project } from '../projects'

type ScreenProps = {
  src?: string
  alt: string
  project: Project
  side: 'l' | 'r'
  label?: string
}

export function Screen({ src, alt, project, side, label }: ScreenProps) {
  if (src) return <img className="hm-screen__img" src={src} alt={alt} />
  return (
    <div className={`hm-ph hm-ph--${side}`} style={{ '--accent': project.accent } as CSSProperties}>
      <span className="hm-ph__tag">{project.shortLabel}</span>
      <span className="hm-ph__label">{label ?? `screen 0${side === 'l' ? 1 : 2}`}</span>
      {side === 'l' ? (
        <>
          <span className="hm-ph__pill" />
          <span className="hm-ph__bar" />
        </>
      ) : (
        <>
          <span className="hm-ph__lines">
            <span />
            <span />
            <span />
          </span>
          <span className="hm-ph__fade" />
          <span className="hm-ph__dot" />
        </>
      )}
    </div>
  )
}

function Phone({ side, children }: { side: 'l' | 'r'; children: React.ReactNode }) {
  return (
    <div className={`hm-phone-pos hm-phone-pos--${side}`}>
      <div className={`hm-phone hm-phone--${side}`}>
        <span className="hm-phone__btn hm-phone__btn--l1" />
        <span className="hm-phone__btn hm-phone__btn--l2" />
        <span className="hm-phone__btn hm-phone__btn--l3" />
        <span className="hm-phone__btn hm-phone__btn--r1" />
        <div className="hm-phone__screen">
          {children}
          <span className="hm-phone__island" />
        </div>
      </div>
    </div>
  )
}

function Monitor({ project }: { project: Project }) {
  return (
    <div className="hm-monitor-pos">
      <div className="hm-monitor-3d">
        <div className="hm-monitor">
          <div className="hm-monitor__screen" style={{ '--accent': project.accent } as CSSProperties}>
            <div className="hm-monitor__caption">
              <div>
                Movember No.004
                <br />
                Fundraising Platform
              </div>
              <div>
                1366 × 1024
                <br />
                &gt;&nbsp;&nbsp;@2x
              </div>
              <div>
                Place your
                <br />
                design here
              </div>
            </div>
          </div>
        </div>
        <div className="hm-monitor__neck" />
        <div className="hm-monitor__foot" />
      </div>
    </div>
  )
}

function bigNumber(index: number) {
  return `0${index}`
}

export function Stage({ active }: { active: number }) {
  return (
    <div className="hm-stage hm-hip" aria-hidden="true">
      {projects.map((p, i) => (
        <div key={p.slug} className={`hm-layer is-${layerState(i, active)}`}>
          {p.device !== 'none' && <div className="hm-bignum">{bigNumber(i)}</div>}
          {p.device === 'phones' && (
            <>
              <Phone side="l">
                <Screen src={p.screens[0]} alt="" project={p} side="l" />
              </Phone>
              <Phone side="r">
                <Screen src={p.screens[1]} alt="" project={p} side="r" />
              </Phone>
            </>
          )}
          {p.device === 'monitor' && <Monitor project={p} />}
        </div>
      ))}
    </div>
  )
}
