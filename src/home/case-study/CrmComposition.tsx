import { useEffect, useState, type CSSProperties } from 'react'
import { useLive } from './primitives'
import s from './CrmComposition.module.css'

type Id = 'deal' | 'about' | 'report' | 'history' | 'logo' | 'comms' | 'task'
type Box = [number, number, number, number, number | string]

const IDS: Id[] = ['deal', 'about', 'report', 'history', 'logo', 'comms', 'task']
const DONE = 12
const LAST = 13
const BASE = [350, 450, 450, 400, 240, 240, 240, 240, 240, 240, 240, 1000, 2800, 500]
const FLY_DUR = '1.05s'
const WIRE_DUR = '0.40s'
const ACCENT = '#111111'

const WIRES: Record<Id, string> = {
  deal: 'M 140 730 C 140 690.4 719 681.6 719 642',
  about: 'M 360 730 C 360 690.4 746 681.6 746 642',
  report: 'M 580 730 C 580 690.4 773 681.6 773 642',
  history: 'M 800 730 L 800 642',
  logo: 'M 1020 730 C 1020 690.4 827 681.6 827 642',
  comms: 'M 1240 730 C 1240 690.4 854 681.6 854 642',
  task: 'M 1460 730 C 1460 690.4 881 681.6 881 642',
}

const SHAPES: Record<Id, Box[]> = {
  deal: [[12, 100, 44, 44, '50%']],
  about: [[11, 154, 122, 26, 13]],
  report: [[10, 66, 74, 70, 8]],
  history: [[11, 218, 122, 26, 13]],
  logo: [
    [12, 80, 32, 32, '50%'],
    [49, 80, 32, 32, '50%'],
  ],
  comms: [[13, 118, 120, 100, 10]],
  task: [[12, 227, 32, 32, '50%']],
}

const TARGETS: [Id, ...Box][] = [
  ['logo', 712, 289, 23, 23, '50%'],
  ['logo', 739, 289, 23, 23, '50%'],
  ['about', 771, 291, 94, 22, 11],
  ['deal', 712, 325, 52, 52, '50%'],
  ['report', 777, 325, 88, 85, 9],
  ['task', 712, 386, 23, 23, '50%'],
  ['history', 712, 426, 153, 29, 14.5],
  ['comms', 712, 466, 153, 117, 11],
]

const FLY: Record<Id, string> = {
  deal: s.fDeal,
  about: s.fAbout,
  report: s.fReport,
  history: s.fHistory,
  logo: s.fLogo,
  comms: s.fComms,
  task: s.fTask,
}

const box = ([left, top, width, height, borderRadius]: Box): CSSProperties => ({ left, top, width, height, borderRadius })
const tint = 'rgba(107,102,95,0.16)'
const cx = (...names: (string | false)[]) => names.filter(Boolean).join(' ')

export function CrmComposition() {
  const [ref, live] = useLive<HTMLDivElement>()
  const [step, setStep] = useState(0)
  const [hover, setHover] = useState<Id | null>(null)

  useEffect(() => {
    if (!live) {
      setStep(0)
      return
    }
    const id = window.setTimeout(() => setStep((v) => (v >= LAST ? 0 : v + 1)), BASE[step])
    return () => window.clearTimeout(id)
  }, [live, step])

  const shown = live ? step : DONE
  const go = (id: Id) => shown >= 4 + IDS.indexOf(id)
  const on = (id: Id) => go(id) || hover === id
  const hl = (id: Id) => hover === id
  const enter = (id: Id) => () => setHover(id)
  const leave = (id: Id) => () => setHover((h) => (h === id ? null : h))

  const rootClass = cx(
    s.root,
    !live && s.still,
    shown >= 1 && s.pOn,
    shown >= 2 && s.rOn,
    shown >= 3 && s.cOn,
    shown === LAST && s.fading,
  )

  return (
    <div ref={ref} className={rootClass}>
      <div className={s.inner}>
        <svg
          width="1600"
          height="1250"
          viewBox="0 0 1600 1250"
          aria-hidden="true"
          style={{ position: 'absolute', left: 0, top: 0, width: 1600, height: 1250, pointerEvents: 'none', fill: 'none', strokeLinecap: 'round' }}
        >
          <path d="M 800 100 L 800 1010" stroke="#6B665F" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="0 8" />
          <g stroke="#6B665F" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="0 8">
            {IDS.map((id) => (
              <path key={id} className={cx(s.wb, on(id) && s.wbOff)} d={WIRES[id]} />
            ))}
          </g>
          <g stroke="#111111" strokeWidth="1.25">
            <path d="M 65 1054 L 65 1064 L 1535 1064 L 1535 1054" />
          </g>
          <g strokeWidth="2" strokeDasharray="0 8">
            {IDS.map((id) => (
              <path key={id} className={cx(s.wa, on(id) && s.waOn)} stroke={ACCENT} style={{ transitionDuration: WIRE_DUR }} d={WIRES[id]} />
            ))}
          </g>
        </svg>

        <div className={s.cap} style={{ left: 665, top: 106, width: 270 }}>
          <span style={{ padding: '0 8px', background: '#E8E4DB' }}>BREEZE</span>
        </div>
        <div
          className={s.abs}
          style={{ left: 665, top: 138, width: 270, height: 504, boxSizing: 'border-box', border: 0, borderRadius: 29, background: '#FFFFFF' }}
        />

        <div className={s.stage}>
          <div className={cx(s.abs, s.pill)} style={{ left: 787, top: 169, width: 126, height: 34, borderRadius: 17, background: tint }} />
          <div className={cx(s.abs, s.rl)} style={{ left: 690, top: 221, width: 198, height: 13, borderRadius: 6.5, background: tint }} />
          <div className={cx(s.abs, s.rl, s.rl2)} style={{ left: 690, top: 241, width: 162, height: 13, borderRadius: 6.5, background: tint }} />
          <div
            className={cx(s.abs, s.card)}
            style={{ left: 690, top: 269, width: 196, height: 333, boxSizing: 'border-box', border: 0, borderRadius: 22, background: tint }}
          />
          {TARGETS.map(([id, ...b], i) => (
            <div
              key={i}
              className={cx(s.abs, s.tgt, go(id) && s.tgtGo, hl(id) && s.tgtHl)}
              style={{ ...box(b), animationDelay: FLY_DUR }}
            />
          ))}
        </div>

        {IDS.map((id, k) => (
          <button
            key={id}
            type="button"
            tabIndex={-1}
            className={cx(s.ph, go(id) && s.phGo, hl(id) && s.phHl)}
            aria-label={`${id[0].toUpperCase()}${id.slice(1)} screen`}
            onMouseEnter={enter(id)}
            onMouseLeave={leave(id)}
            onFocus={enter(id)}
            onBlur={leave(id)}
            style={{ left: 65 + k * 220 }}
          >
            {SHAPES[id].map((b, i) => (
              <span key={i} className={s.sh} style={box(b)} />
            ))}
          </button>
        ))}

        {IDS.map((id, k) => (
          <div key={id} className={cx(s.cap, s.lbl, go(id) && s.lblGo, hl(id) && s.lblHl)} style={{ left: 65 + k * 220, top: 1024, width: 150 }}>
            {id.toUpperCase()}
          </div>
        ))}

        <div className={s.cap} style={{ left: 500, top: 1080, width: 600, fontSize: 14, lineHeight: '20px', fontWeight: 600 }}>
          A MOBILE CRM, MANY INTERACTION POINTS
        </div>

        <div className={s.stage}>
          {IDS.map((id) => (
            <div key={id} className={cx(s.fly, FLY[id], go(id) && s.flyGo)} aria-hidden="true" style={{ animationDuration: FLY_DUR }}>
              {id === 'logo' && (
                <>
                  <span style={{ left: 0 }} />
                  <span style={{ left: 27 }} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
