import type { CSSProperties, ReactNode } from 'react'
import { useReducedMotion } from '../hooks'
import { useLive } from './primitives'
import s from './BreezeVoice.module.css'

const SPARK = 'M12 0C12.9 6.6 17.4 11.1 24 12C17.4 12.9 12.9 17.4 12 24C11.1 17.4 6.6 12.9 0 12C6.6 11.1 11.1 6.6 12 0Z'

const FIRST_REPLY = 'I’m checking your CRM records to find the most recently created deal.'
const SECOND_REPLY = 'Here it is, it was Umbrella Inc. Would you like me to give you a brief history of your interactions with Umbrella Inc.?'

const FROZEN_AT = 9.5

const supportsTimeline = typeof CSS !== 'undefined' && typeof CSS.registerProperty === 'function'

const BARS = [
  [2, 8, 8, 0],
  [6.5, 5, 14, 0.15],
  [11, 2, 20, 0.3],
  [15.5, 6, 12, 0.1],
  [20, 9, 6, 0.25],
]

const ACTIONS: ReactNode[] = [
  <>
    <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </>,
  <>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </>,
  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />,
  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />,
  <>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </>,
]

function Words({ text, start, step }: { text: string; start: number; step: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i}>
          <span className={s.word} style={{ '--s': (start + i * step).toFixed(2) } as CSSProperties}>
            {word}
          </span>{' '}
        </span>
      ))}
    </>
  )
}

export function BreezeVoice() {
  const [ref, live] = useLive<HTMLDivElement>()
  const reduceMotion = useReducedMotion()
  const frozen = reduceMotion || !supportsTimeline
  const classes = [s.root, frozen ? s.frozen : '', !live ? s.paused : ''].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes} style={frozen ? ({ '--t': FROZEN_AT } as CSSProperties) : undefined} aria-hidden="true">
      <div className={s.status}>
        <span className={s.time}>9:41</span>
        <span className={s.island} />
        <span className={s.icons}>
          <svg width="18" height="12" viewBox="0 0 18 12">
            <rect x="0" y="8" width="3" height="4" rx="1" fill="#000" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#000" />
            <rect x="10" y="3" width="3" height="9" rx="1" fill="#000" />
            <rect x="15" y="0" width="3" height="12" rx="1" fill="#000" />
          </svg>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
            <path d="M1.2 4.2a10.5 10.5 0 0 1 14.6 0" />
            <path d="M3.9 7a6.7 6.7 0 0 1 9.2 0" />
            <circle cx="8.5" cy="10" r="0.6" fill="#000" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13">
            <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="#000" strokeOpacity="0.4" />
            <rect x="2" y="2" width="20" height="9" rx="2.5" fill="#000" />
            <path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" fill="#000" fillOpacity="0.4" />
          </svg>
        </span>
      </div>

      <div className={s.fade}>
        <div className={`${s.glow} ${s.peach}`} />
        <div className={`${s.glow} ${s.orange}`} />
        <div className={`${s.glow} ${s.pink}`} />

        <div className={s.group}>
          <svg className={s.spark} width="24" height="24" viewBox="0 0 24 24">
            <path d={SPARK} fill="#FF4A00" />
          </svg>
          <div className={s.label}>
            <span>
              Ready to chat<span className={s.d1}>.</span>
              <span className={s.d2}>.</span>
              <span className={s.d3}>.</span>
            </span>
          </div>
        </div>

        <div className={s.thread}>
          <div className={s.user}>What was the last deal I created in my portal</div>
          <p className={s.reply}>
            <Words text={FIRST_REPLY} start={4.5} step={0.05} />
          </p>
          <div className={s.tools}>
            <div className={s.checking}>
              <svg className={s.turn} width="12" height="12" viewBox="0 0 24 24">
                <path d={SPARK} fill="#FF4A00" />
              </svg>
              <span>Checking your CRM records</span>
            </div>
            <div className={s.checked}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5F6672" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
              <span>Checked your CRM records</span>
            </div>
          </div>
          <p className={s.reply}>
            <Words text={SECOND_REPLY} start={7.1} step={0.04} />
          </p>
          <div className={s.meta}>
            <p>AI-generated content may be innacurate</p>
            <div className={s.actions}>
              {ACTIONS.map((icon, i) => (
                <span key={i} className={s.action}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d1d21" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                  </svg>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={s.controls}>
          <span className={`${s.circle} ${s.settings}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <div className={s.right}>
            <span className={`${s.circle} ${s.mic}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d1d21" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </span>
            <div className={s.pill}>
              <div className={s.dark} />
              <div className={s.gradient} />
              <div className={s.pillInner}>
                <span>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    {BARS.map(([x, y, h, delay]) => (
                      <rect key={x} className={s.bar} style={{ animationDelay: `${delay}s` }} x={x} y={y} width="2" height={h} rx="1" fill="#ffffff" />
                    ))}
                  </svg>
                </span>
                <span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
