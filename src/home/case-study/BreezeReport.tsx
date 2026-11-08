import { useEffect, useId, useState, type CSSProperties } from 'react'
import s from './BreezeReport.module.css'

type Theme = 'light' | 'dark'
type Tab = 'created' | 'won'
type State = { t: number; tab: Tab; chartAt: number | null }

const INTRO = 'I’m checking your CRM records to find the most recently created deals.'
const REPLY =
  'Here is a rundown of your deal pipeline for the last 90 days. There seems to be a strong uptick in late July. Do you want me to look into that trend?'
const CREATED = [
  37, 13, 24, 24, 45, 40, 40, 33, 33, 57, 57, 68, 68, 58, 57, 57, 57, 46, 46, 57, 57, 51, 56, 54, 56, 56, 67, 60, 60, 44, 44, 57, 57, 68, 63, 78, 78, 67,
  67, 61, 60, 51, 78, 78, 78, 84, 83, 68, 72, 72, 87, 87, 121, 121, 112, 115, 125,
]
const WON = CREATED.map((v, i) => Math.max(1, Math.round(v * 0.22 + 4 * Math.sin(i * 1.7) + (i % 5 === 0 ? 3 : 0))))

const TICK = 33
const WORD_MS = 55
const AGENT_AT = 450
const INTRO_AT = 1250
const INTRO_END = INTRO_AT + INTRO.split(' ').length * WORD_MS
const CHECK_AT = INTRO_END + 200
const CHECKED_AT = CHECK_AT + 1100
const CARD_AT = CHECKED_AT + 250
const CHART_AT = CARD_AT + 650
const REPLY_AT = CHART_AT + 1900
const REPLY_END = REPLY_AT + REPLY.split(' ').length * WORD_MS
const FOOT_AT = REPLY_END + 250
const END = FOOT_AT + 900

const INIT: State = { t: 0, tab: 'created', chartAt: null }

const PALETTE = {
  dark: {
    bg: '#212121',
    text: '#EDEDED',
    muted: '#B4B4B4',
    bubble: '#141414',
    border: '#3E3E3E',
    tile: '#141414',
    pill: '#3B3B3B',
    grid: '#3A3A3A',
    line: '#2A5BE8',
    area: '#3A4048',
    seg: '#8C8C8C',
    voiceBg: '#EDEDED',
    voiceFg: '#1F1F1F',
    gradEnd: '#E9B5E6',
    axis: '#EDEDED',
  },
  light: {
    bg: '#FFFFFF',
    text: '#1F1F1F',
    muted: '#5E5E5E',
    bubble: '#F3F2EE',
    border: '#DEDEDE',
    tile: '#F1F0EC',
    pill: '#EAEAEA',
    grid: '#E4E4E4',
    line: '#1D5BD8',
    area: '#EEF5FB',
    seg: '#9C9C9C',
    voiceBg: '#1F1F1F',
    voiceFg: '#FFFFFF',
    gradEnd: '#E9A8DA',
    axis: '#1F1F1F',
  },
}

function words(text: string, start: number, now: number) {
  if (now < start) return []
  const all = text.split(' ')
  const n = Math.min(all.length, Math.floor((now - start) / WORD_MS) + 1)
  return all.slice(0, n).map((w, i) => w + (i < all.length - 1 ? ' ' : ''))
}

function chart(data: number[], max: number) {
  const x0 = 28
  const x1 = 332
  const base = 194
  const top = 9
  const pts = data.map((v, i) => [x0 + (i * (x1 - x0)) / (data.length - 1), base - (v / max) * (base - top)])
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = line + ' L' + x1 + ' ' + base + ' L' + x0 + ' ' + base + ' Z'
  let len = 0
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return { line, area, len: Math.ceil(len) + 2, last: pts[pts.length - 1] }
}

const CHARTS = { created: chart(CREATED, 200), won: chart(WON, 40) }

const iconBtn = (color: string, width: number): CSSProperties => ({
  width,
  height: 44,
  border: 0,
  background: 'transparent',
  color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  padding: 0,
})

const roundBtn = (border: string, color: string): CSSProperties => ({
  width: 37,
  height: 37,
  borderRadius: '50%',
  border: `1px solid ${border}`,
  background: 'transparent',
  color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
})

const footBtn = (color: string): CSSProperties => ({
  width: 33,
  height: 44,
  border: 0,
  background: 'transparent',
  color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
})

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export function BreezeReport({ theme, live }: { theme: Theme; live: boolean }) {
  const [st, setSt] = useState<State>(INIT)
  const inputId = useId()

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => {
      setSt((prev) => {
        const t = prev.t + TICK
        const chartEnd = (prev.chartAt ?? CHART_AT) + 1800
        return t > Math.max(END, chartEnd) + 3500 ? INIT : { ...prev, t }
      })
    }, TICK)
    return () => {
      window.clearInterval(id)
      setSt(INIT)
    }
  }, [live])

  const c = PALETTE[theme]
  const t = live ? st.t : END
  const isWon = st.tab === 'won'
  const max = isWon ? 40 : 200
  const step = max / 4
  const ch = CHARTS[st.tab]
  const chartStart = st.chartAt ?? CHART_AT
  const p = live ? Math.max(0, Math.min(1, (t - chartStart) / 1500)) : 1
  const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
  const on = { bg: '#0B4D4F', fg: '#FFFFFF' }
  const off = { bg: 'transparent', fg: c.text }
  const segA = isWon ? off : on
  const segB = isWon ? on : off
  const introWords = words(INTRO, INTRO_AT, t)
  const replyWords = words(REPLY, REPLY_AT, t)

  const pick = (tab: Tab) => {
    if (tab === st.tab) return
    setSt((prev) => ({ ...prev, tab, chartAt: prev.t }))
  }
  const replay = () => setSt(INIT)

  const segStyle = (sg: { bg: string; fg: string }): CSSProperties => ({
    flex: '1 1 0',
    border: 0,
    borderRadius: 17,
    font: '500 13px Figtree, sans-serif',
    cursor: 'pointer',
    background: sg.bg,
    color: sg.fg,
  })

  return (
    <div
      className={live ? s.root : `${s.root} ${s.still}`}
      aria-hidden="true"
      style={{ background: c.bg, color: c.text }}
    >
      <header style={{ padding: '47px 10px 0 12px', height: 44, display: 'flex', alignItems: 'center', gap: 4 }}>
        <button type="button" tabIndex={-1} aria-label="Close and replay" onClick={replay} style={iconBtn(c.text, 44)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M19 5L5 19M5 5l14 14" />
          </svg>
        </button>
        <h1
          style={{
            margin: '0 0 0 6px',
            flexGrow: 1,
            minWidth: 0,
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontWeight: 500,
            fontSize: 20,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Your open deals and pipeline
        </h1>
        <button type="button" tabIndex={-1} aria-label="Rename chat" style={iconBtn(c.text, 38)}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.3313 2.5C13.8313 2.50001 14.3064 2.69994 14.6564 3.04993L16.9623 5.36865C17.6873 6.0999 17.6873 7.28755 16.9623 8.0188L7.65015 17.3315C7.53145 17.4502 7.37507 17.5122 7.20642 17.5122L7.19971 17.5189H3.125C2.78131 17.5189 2.50009 17.2376 2.5 16.8939V12.8186C2.50004 12.6499 2.56881 12.4936 2.68127 12.3749L12.0062 3.04993C12.3625 2.69369 12.8313 2.5 13.3313 2.5ZM3.7439 13.075V16.2689H6.94397L14.278 8.93433L11.0809 5.7373L3.7439 13.075ZM13.3252 3.7561C13.1565 3.7561 13.0002 3.81874 12.8815 3.93738L11.9623 4.85596L15.1593 8.05298L16.0748 7.13745C16.3186 6.8937 16.3186 6.49985 16.0748 6.2561L13.7689 3.93738C13.6502 3.81867 13.4939 3.75615 13.3252 3.7561Z"
            />
          </svg>
        </button>
        <button type="button" tabIndex={-1} aria-label="Chat history, new activity" style={iconBtn(c.text, 38)}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor" style={{ overflow: 'visible' }}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.75 4.375C14.7812 4.375 15.625 5.21875 15.625 6.25V12.5C15.625 13.5312 14.7812 14.375 13.75 14.375H6.50635L3.56262 17.3187C3.4445 17.4368 3.28297 17.4987 3.12134 17.4994C3.04133 17.499 2.96143 17.4869 2.88757 17.45C2.65632 17.3562 2.5 17.125 2.5 16.875V6.25C2.5 5.21875 3.34375 4.375 4.375 4.375H13.75ZM4.375 5.625C4.03125 5.625 3.75 5.90625 3.75 6.25V15.3687L5.80627 13.3124C5.92502 13.1937 6.08128 13.1311 6.25 13.1311H13.75C14.0938 13.1311 14.375 12.8499 14.375 12.5061V6.2561C14.3749 5.91242 14.0937 5.6311 13.75 5.6311H4.375V5.625Z"
            />
            <path d="M16.25 1.875C17.2812 1.875 18.125 2.71875 18.125 3.75V10C18.125 10.3438 17.8438 10.625 17.5 10.625C17.1562 10.625 16.875 10.3438 16.875 10V3.75C16.875 3.40625 16.5938 3.125 16.25 3.125H6.875C6.53125 3.125 6.25 2.84375 6.25 2.5C6.25 2.15625 6.53125 1.875 6.875 1.875H16.25Z" />
            <circle cx="17.2" cy="2.8" r="3" fill="#FF5C35" stroke={c.bg} strokeWidth="1.4" />
          </svg>
        </button>
        <button type="button" tabIndex={-1} aria-label="More options" style={iconBtn(c.text, 38)}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="16.25" r="1.25" />
            <circle cx="10" cy="10" r="1.25" />
            <circle cx="10" cy="3.75" r="1.25" />
          </svg>
        </button>
      </header>

      <main style={{ padding: '16px 16px 0 16px', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            alignSelf: 'flex-end',
            width: 307,
            boxSizing: 'border-box',
            background: c.bubble,
            borderRadius: 15,
            padding: '12px 16px 12px 15px',
            fontSize: 15,
            lineHeight: '21px',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, verticalAlign: 'top', marginLeft: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5C35" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <strong style={{ fontWeight: 600 }}>Deal agent</strong>
          </span>
          {'  Can you give me an overview of my deals created in the last 90 days?'}
        </div>

        {t >= AGENT_AT && (
          <div className={s.fade} style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 6, height: 22 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF5C35">
              <path d="M12 1c.8 5.6 5.4 10.2 11 11-5.6.8-10.2 5.4-11 11-.8-5.6-5.4-10.2-11-11C6.6 11.2 11.2 6.6 12 1z" />
            </svg>
            <span
              className={t < CHECKED_AT ? `${s.grad} ${s.gradLive}` : s.grad}
              style={{
                fontSize: 13,
                fontWeight: 500,
                backgroundImage: `linear-gradient(90deg, #FF5C35 0%, #FF5C35 18%, #3B6FE0 50%, ${c.gradEnd} 72%, #FF5C35 100%)`,
              }}
            >
              Sending details to Deal agent
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={c.muted}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: 4 }}
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        )}

        <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: '17px', minHeight: 34 }}>
          {introWords.map((w, i) => (
            <span key={i} className={s.tok}>
              {w}
            </span>
          ))}
        </p>

        <div style={{ height: 22, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.muted }}>
          {t >= CHECK_AT && t < CHECKED_AT && (
            <span
              className={`${s.shim} ${s.fade}`}
              style={{
                backgroundImage: `linear-gradient(90deg, ${c.muted} 0%, ${c.muted} 40%, ${c.text} 50%, ${c.muted} 60%, ${c.muted} 100%)`,
              }}
            >
              Checking latest deals created…
            </span>
          )}
          {t >= CHECKED_AT && (
            <span className={s.fade} style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" {...stroke} strokeWidth={2.4}>
                <path d="M9 6l6 6-6 6" />
              </svg>
              Checked latest deals created
            </span>
          )}
        </div>

        {t >= CARD_AT && (
          <article
            className={s.rise}
            style={{ marginTop: 15, width: '100%', boxSizing: 'border-box', border: `1px solid ${c.border}`, borderRadius: 18 }}
          >
            <div style={{ padding: '15px 13px', display: 'flex', alignItems: 'center', gap: 13 }}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 6,
                  background: c.tile,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.text,
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.75 12C7.1625 12 7.5 12.3375 7.5 12.75V17.25C7.5 17.6625 7.1625 18 6.75 18C6.3375 18 6 17.6625 6 17.25V12.75C6 12.3375 6.3375 12 6.75 12Z" />
                  <path d="M12.75 6C13.1625 6 13.5 6.3375 13.5 6.75C13.5 7.1625 13.1625 7.5 12.75 7.5H10.5V17.25C10.5 17.6625 10.1625 18 9.75 18C9.3375 18 9 17.6625 9 17.25V6.75C9 6.3375 9.3375 6 9.75 6H12.75Z" />
                  <path d="M17.25 9C17.6625 9 18 9.3375 18 9.75V17.25C18 17.6625 17.6625 18 17.25 18C16.8375 18 16.5 17.6625 16.5 17.25V10.5H14.25V17.25C14.25 17.6625 13.9125 18 13.5 18C13.0875 18 12.75 17.6625 12.75 17.25V9.75C12.75 9.3375 13.0875 9 13.5 9H17.25Z" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.75 3C19.9875 3 21 4.0125 21 5.25V18.75C21 19.9875 19.9875 21 18.75 21H5.25C4.0125 21 3 19.9875 3 18.75V5.25C3 4.0125 4.0125 3 5.25 3H18.75ZM5.25 4.5C4.8375 4.5 4.5 4.8375 4.5 5.25V18.75C4.5 19.1625 4.8375 19.5 5.25 19.5H18.75C19.1625 19.5 19.5 19.1625 19.5 18.75V5.25C19.5 4.8375 19.1625 4.5 18.75 4.5H5.25Z"
                  />
                </svg>
              </span>
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Campaign pipeline report</span>
                <span style={{ fontSize: 13 }}>Chart artifact</span>
              </div>
              <span style={{ fontSize: 12, color: c.muted }}>v1</span>
            </div>

            <div style={{ margin: '0 13px', borderTop: `1px solid ${c.border}`, padding: '21px 0 18px' }}>
              <div className={`${s.fade} ${s.d1}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Campaign pipeline</span>
                <span style={{ fontSize: 13, background: c.pill, borderRadius: 5, padding: '3px 8px' }}>Last 90 days</span>
              </div>

              <div
                className={`${s.fade} ${s.d2}`}
                role="tablist"
                aria-label="Metric"
                style={{
                  marginTop: 18,
                  height: 41,
                  boxSizing: 'border-box',
                  border: `1.5px solid ${c.seg}`,
                  borderRadius: 21,
                  padding: 3,
                  display: 'flex',
                }}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  className={s.seg}
                  role="tab"
                  aria-selected={!isWon}
                  onClick={() => pick('created')}
                  style={segStyle(segA)}
                >
                  Deal created
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  className={s.seg}
                  role="tab"
                  aria-selected={isWon}
                  onClick={() => pick('won')}
                  style={segStyle(segB)}
                >
                  Deals closed won
                </button>
              </div>

              <div className={`${s.fade} ${s.d3}`} style={{ marginTop: 22, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                {isWon ? 'Deals closed won count' : 'Deals created count'}
              </div>

              <div style={{ position: 'relative', marginTop: 8, width: 330, height: 226 }}>
                <svg
                  width="330"
                  height="226"
                  viewBox="0 0 330 226"
                  style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}
                >
                  <g className={`${s.fade} ${s.d3}`}>
                    {[9, 55, 101.5, 148, 194].map((y) => (
                      <line key={y} x1="30" x2="330" y1={y} y2={y} stroke={c.grid} />
                    ))}
                  </g>
                  <path d={ch.area} fill={c.area} style={{ clipPath: `inset(0 ${((1 - e) * 100).toFixed(1)}% 0 0)` }} />
                  <path
                    d={ch.line}
                    fill="none"
                    stroke={c.line}
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    style={{ strokeDasharray: ch.len, strokeDashoffset: (ch.len * (1 - e)).toFixed(1) }}
                  />
                  <circle cx={ch.last[0].toFixed(1)} cy={ch.last[1].toFixed(1)} r="3.5" fill={c.line} style={{ opacity: p >= 1 ? 1 : 0 }} />
                </svg>
                <div
                  className={`${s.fade} ${s.d3}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 28,
                    height: 200,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    lineHeight: '16px',
                    color: c.axis,
                  }}
                >
                  {[max, step * 3, step * 2, step, 0].map((v, i) => (
                    <span key={i} style={{ position: 'absolute', left: 0, top: [1, 47, 93, 140, 186][i] }}>
                      {String(v)}
                    </span>
                  ))}
                </div>
                <div
                  className={`${s.fade} ${s.d4}`}
                  style={{ position: 'absolute', left: 0, top: 206, width: 330, height: 18, fontSize: 13, lineHeight: '18px', color: c.text }}
                >
                  {(
                    [
                      ['May', 58, 24],
                      ['June', 112, 28],
                      ['July', 169, 28],
                      ['Aug', 226, 26],
                      ['Sept', 282, 28],
                    ] as const
                  ).map(([m, left, width]) => (
                    <span key={m} style={{ position: 'absolute', left, width, textAlign: 'center' }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`${s.fade} ${s.d4}`} style={{ textAlign: 'center', marginTop: 4, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                Weeks
              </div>
            </div>
          </article>
        )}

        <p style={{ margin: '22px 0 0', fontSize: 15, lineHeight: '21px', paddingRight: 6 }}>
          {replyWords.map((w, i) => (
            <span key={i} className={s.tok}>
              {w}
            </span>
          ))}
        </p>

        {t >= FOOT_AT && (
          <div>
            <p className={s.fade} style={{ margin: '18px 0 0', fontSize: 12 }}>
              AI-generated content may be inaccurate
            </p>
            <div style={{ marginTop: 8, display: 'flex', gap: 0, marginLeft: 2 }}>
              <button type="button" tabIndex={-1} className={`${s.fade} ${s.d1}`} aria-label="Share" style={footBtn(c.text)}>
                <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
                  <path d="M8 9H5v12h14V9h-3" />
                  <path d="M12 15V3M8 7l4-4 4 4" />
                </svg>
              </button>
              <button type="button" tabIndex={-1} className={`${s.fade} ${s.d2}`} aria-label="Copy" style={footBtn(c.text)}>
                <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
                  <rect x="8" y="8" width="13" height="13" rx="2" strokeDasharray="3 2.5" />
                  <path d="M16 4H5a2 2 0 0 0-2 2v10" />
                </svg>
              </button>
              <button type="button" tabIndex={-1} className={`${s.fade} ${s.d3}`} aria-label="Good response" style={footBtn(c.text)}>
                <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
                  <path d="M7 10v11H3V10z" />
                  <path d="M7 10l4-8a3 3 0 0 1 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.4 7.5a2 2 0 0 1-2 1.7H7" />
                </svg>
              </button>
              <button type="button" tabIndex={-1} className={`${s.fade} ${s.d4}`} aria-label="Bad response" style={footBtn(c.text)}>
                <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
                  <path d="M17 14V3h4v11z" />
                  <path d="M17 14l-4 8a3 3 0 0 1-3-3v-4H4.5a2 2 0 0 1-2-2.3l1.4-7.5a2 2 0 0 1 2-1.7H17" />
                </svg>
              </button>
              <button type="button" tabIndex={-1} className={`${s.fade} ${s.d5}`} aria-label="Report a problem" style={footBtn(c.text)}>
                <svg width="17" height="17" viewBox="0 0 24 24" {...stroke}>
                  <path d="M3 3l18 18" />
                  <path d="M8 8a4 4 0 0 0-1 3v3a5 5 0 0 0 9 3M17 13v-2a5 5 0 0 0-7.5-4.3" />
                  <path d="M3 12h4M17 12h4M5 19l2.5-2M19 5l-2 2M5 5l2 2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 37,
          height: 107,
          boxSizing: 'border-box',
          border: `1.5px solid ${c.border}`,
          borderRadius: 23,
          background: c.bg,
          padding: '13px 11px 11px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span className={s.caret} style={{ position: 'absolute', left: 0, top: 4 }} />
          <label htmlFor={inputId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            Message Breeze Assistant
          </label>
          <input
            id={inputId}
            tabIndex={-1}
            placeholder="Ask Breeze Assistant anything..."
            style={{
              width: '100%',
              border: 0,
              outline: 'none',
              background: 'transparent',
              font: '400 17px Figtree, sans-serif',
              color: c.text,
              height: 28,
              padding: '0 0 0 3px',
              caretColor: '#FF5C35',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <button type="button" tabIndex={-1} aria-label="Add attachment" style={roundBtn(c.border, c.text)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 4v16M4 12h16" />
            </svg>
          </button>
          <span style={{ flexGrow: 1 }} />
          <button type="button" tabIndex={-1} aria-label="Dictate" style={roundBtn(c.border, c.text)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
            </svg>
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Start voice conversation"
            style={{ ...roundBtn(c.border, c.voiceFg), border: 0, background: c.voiceBg }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
