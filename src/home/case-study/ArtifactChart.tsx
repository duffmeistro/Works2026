import { useEffect, useId, useState, type CSSProperties } from 'react'
import s from './ArtifactChart.module.css'

export type ChartType = 'stacked' | 'gauge' | 'bars' | 'segmented' | 'allocation'
export type ChartTheme = 'light' | 'dark'

type ArtifactChartProps = {
  chart?: ChartType
  theme?: ChartTheme
  speed?: number
  live?: boolean
  still?: boolean
  decorative?: boolean
}

type Palette = Record<
  | 'bg'
  | 'text'
  | 'muted'
  | 'bubble'
  | 'border'
  | 'tile'
  | 'chip'
  | 'chipX'
  | 'grid'
  | 'axis'
  | 'seg'
  | 'voiceBg'
  | 'voiceFg'
  | 'gradEnd'
  | 's1'
  | 's2'
  | 's3'
  | 'pink'
  | 'orange'
  | 'amber'
  | 'teal'
  | 'other'
  | 'track'
  | 'panel'
  | 'pill'
  | 'up',
  string
>

const DARK: Palette = {
  bg: '#212121',
  text: '#EDEDED',
  muted: '#B4B4B4',
  bubble: '#141414',
  border: '#3E3E3E',
  tile: '#141414',
  chip: '#2F2F2F',
  chipX: '#3B3B3B',
  grid: '#3A3A3A',
  axis: '#CFCFCF',
  seg: '#8C8C8C',
  voiceBg: '#EDEDED',
  voiceFg: '#1F1F1F',
  gradEnd: '#E9B5E6',
  s1: '#7D9AE3',
  s2: '#C9D255',
  s3: '#B0457F',
  pink: '#F0B4D4',
  orange: '#E0643C',
  amber: '#EFC15A',
  teal: '#4FB3A9',
  other: '#4A4A4A',
  track: '#2B2B2B',
  panel: '#2A2A2A',
  pill: '#3B3B3B',
  up: '#6BC966',
}

const LIGHT: Palette = {
  bg: '#FFFFFF',
  text: '#1F1F1F',
  muted: '#5E5E5E',
  bubble: '#F3F2EE',
  border: '#DEDEDE',
  tile: '#F1F0EC',
  chip: '#F1F1F1',
  chipX: '#E4E4E4',
  grid: '#DADADA',
  axis: '#1F1F1F',
  seg: '#9C9C9C',
  voiceBg: '#1F1F1F',
  voiceFg: '#FFFFFF',
  gradEnd: '#E9A8DA',
  s1: '#6B8AD6',
  s2: '#C3CC48',
  s3: '#5E1640',
  pink: '#E9A3C6',
  orange: '#D9532B',
  amber: '#E9B949',
  teal: '#2F8F87',
  other: '#C9C9C9',
  track: '#F1F0EC',
  panel: '#F7F6F3',
  pill: '#E8E8E8',
  up: '#2E8B47',
}

const INTRO = 'I’m pulling campaign data from your CRM to build this report.'

const REPLIES: Record<ChartType, string> = {
  stacked: 'Email and webinars are driving most influenced contacts this year, peaking in March. Want me to break this down by region?',
  gauge: 'Brand visibility is at 38%, just into the medium band and up 34% on last period. Want ideas to push it into the high range?',
  bars: 'TechRadar is your biggest interaction source, contributing roughly twice what Salesforce does. Want me to dig into those contacts?',
  segmented: "Organic search and paid social make up almost half of October's pipeline. Want me to compare this against your Q3 targets?",
  allocation: 'Enterprise pipeline is weighted toward early stages, while mid-market is spread more evenly. Want me to flag stalled deals in negotiation?',
}

const META: Record<ChartType, { thread: string; title: string; chartTitle: string; prompt: string; sending: string; checking: string; checked: string }> = {
  stacked: {
    thread: 'Contacts influenced this year',
    title: 'Contacts influenced report',
    chartTitle: 'Contacts influenced by asset type',
    prompt: 'Which assets influenced the most contacts this year?',
    sending: 'Building your contacts influenced report',
    checking: 'Checking asset interactions…',
    checked: 'Checked asset interactions',
  },
  gauge: {
    thread: 'Campaign brand visibility',
    title: 'Brand visibility report',
    chartTitle: 'Campaign brand visibility',
    prompt: 'How visible is our brand across this quarter’s campaigns?',
    sending: 'Measuring campaign brand visibility',
    checking: 'Checking campaign reach and mentions…',
    checked: 'Checked campaign reach and mentions',
  },
  bars: {
    thread: 'Your pipeline sources',
    title: 'Pipeline sources report',
    chartTitle: 'Interaction source contributing to pipeline',
    prompt: 'Which sources are contributing most to our pipeline?',
    sending: 'Building your pipeline sources report',
    checking: 'Checking interaction sources…',
    checked: 'Checked interaction sources',
  },
  segmented: {
    thread: 'October deal sources',
    title: 'Deal source mix report',
    chartTitle: 'Pipeline by deal source',
    prompt: 'What does our deal source mix look like for October?',
    sending: 'Building your deal source mix report',
    checking: 'Checking deal sources…',
    checked: 'Checked deal sources',
  },
  allocation: {
    thread: 'Pipeline by segment',
    title: 'Pipeline by segment report',
    chartTitle: 'Pipeline stage mix by segment',
    prompt: 'How is our pipeline split by stage across each segment?',
    sending: 'Comparing pipeline stages by segment',
    checking: 'Checking deal stages by segment…',
    checked: 'Checked deal stages by segment',
  },
}

const STACK_SETS = [
  {
    label: 'Interaction source',
    series: ['Email', 'Paid social', 'Webinar'],
    data: [
      [27, 20, 35],
      [53, 40, 35],
      [101, 30, 38],
      [92, 47, 15],
      [13, 57, 45],
      [58, 22, 29],
      [82, 28, 24],
      [35, 11, 22],
    ],
  },
  {
    label: 'Asset type',
    series: ['Blog post', 'Landing page', 'Video'],
    data: [
      [40, 22, 18],
      [35, 30, 48],
      [70, 45, 52],
      [60, 38, 30],
      [48, 40, 35],
      [30, 35, 40],
      [66, 30, 30],
      [20, 25, 28],
    ],
  },
  {
    label: 'Region',
    series: ['North America', 'EMEA', 'APAC'],
    data: [
      [50, 18, 12],
      [72, 30, 22],
      [95, 40, 30],
      [80, 45, 28],
      [60, 38, 40],
      [50, 30, 22],
      [70, 40, 25],
      [30, 22, 18],
    ],
  },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

const GAUGE_BANDS: [number, number, string][] = [
  [0, 0.328, '#D0302A'],
  [0.337, 0.652, '#EFC15A'],
  [0.661, 1, '#6BC966'],
]

const H_DATA: [string, number][] = [
  ['hubspot.com', 58],
  ['techradar.com', 255],
  ['zoho.com', 176],
  ['salesforce.com', 133],
]

const SEG_LABELS = ['Organic search', 'Paid social', 'Email', 'Webinars', 'Events', 'Referrals', 'Partners', 'Other']

const SEG_MONTHS = [
  { label: 'August', v: [380, 410, 260, 170, 90, 80, 45, 420], prev: 1799 },
  { label: 'September', v: [430, 455, 230, 150, 120, 70, 40, 450], prev: 1855 },
  { label: 'October', v: [502, 492, 197, 161, 114, 54, 30, 478], prev: 1945 },
]

const STAGE_LABELS = ['Discovery', 'Demo', 'Proposal', 'Negotiation']

const WORD_MS = 55

function timeline(chart: ChartType) {
  const agentAt = 450
  const introAt = 1250
  const introEnd = introAt + INTRO.split(' ').length * WORD_MS
  const checkAt = introEnd + 200
  const checkedAt = checkAt + 1100
  const cardAt = checkedAt + 250
  const chartAt = cardAt + 750
  const replyAt = chartAt + 2000
  const replyEnd = replyAt + REPLIES[chart].split(' ').length * WORD_MS
  const footAt = replyEnd + 250
  return { agentAt, introAt, checkAt, checkedAt, cardAt, chartAt, replyAt, footAt, end: footAt + 1000 }
}

function words(text: string, start: number, now: number) {
  if (now < start) return []
  const all = text.split(' ')
  const n = Math.min(all.length, Math.floor((now - start) / WORD_MS) + 1)
  const out: { w: string; o: number; b: number }[] = []
  for (let i = 0; i < n; i++) {
    const p = Math.max(0, Math.min(1, (now - start - i * WORD_MS) / 280))
    out.push({ w: all[i] + (i < all.length - 1 ? ' ' : ''), o: p, b: (1 - p) * 3 })
  }
  return out
}

const clamp = (x: number) => Math.max(0, Math.min(1, x))
const ease = (x: number) => 1 - Math.pow(1 - x, 3)

function Words({ items }: { items: { w: string; o: number; b: number }[] }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={i} style={{ opacity: item.o, filter: `blur(${item.b.toFixed(1)}px)` }}>
          {item.w}
        </span>
      ))}
    </>
  )
}

export function ArtifactChart({ chart = 'stacked', theme = 'light', speed = 1, live = true, still = false, decorative = false }: ArtifactChartProps) {
  const [time, setTime] = useState(0)
  const [tab, setTab] = useState(0)
  const [month, setMonth] = useState(2)
  const [run, setRun] = useState(0)
  const inputId = useId()
  const L = timeline(chart)

  useEffect(() => {
    if (!live || still) return
    let now = 0
    setTime(0)
    setTab(0)
    setMonth(2)
    const id = window.setInterval(() => {
      now += 33 * speed
      setTime(now)
      if (now > L.end) window.clearInterval(id)
    }, 33)
    return () => window.clearInterval(id)
  }, [live, still, speed, L.end, run])

  const t = still ? L.end : time
  const c = theme === 'dark' ? DARK : LIGHT
  const f = (at: number, d = 400) => ease(clamp((t - at) / d))
  const on = t >= L.chartAt
  const cardP = ease(clamp((t - L.cardAt) / 550))
  const tabIndex = decorative ? -1 : undefined

  const o = {
    agent: f(L.agentAt),
    checked: f(L.checkedAt, 300),
    card: cardP,
    cardY: (1 - cardP) * 16,
    i1: f(L.cardAt + 150),
    i2: f(L.cardAt + 250),
    i3: f(L.cardAt + 350),
    i4: f(L.cardAt + 450),
    i5: f(L.cardAt + 550),
    i6: f(L.chartAt + 1300),
    foot: [0, 80, 160, 240, 320, 400].map((d) => f(L.footAt + d)),
  }

  const meta = META[chart]

  const series = [c.s1, c.s2, c.s3]
  const set = STACK_SETS[tab]
  const sGrid = [400, 300, 200, 100, 0].map((v, i) => ({ y: i * 50, ly: i * 50 - 8, label: v + 'k', color: i === 4 ? c.axis : c.grid }))
  const bars = set.data.map((d, bi) => d.map((v, si) => ({ h: on ? (v / 400) * 200 : 0, color: series[si], delay: bi * 70 + si * 110 })))
  const totals = set.data.map((d) => d[0] + d[1] + d[2])
  const stackAria = 'Stacked bar chart by ' + set.label.toLowerCase() + ', January to August; totals ' + totals.map((v) => v + 'k').join(', ')

  const cx = 165
  const cy = 182
  const r = 108
  const pt = (p: number, rad: number) => [cx + rad * Math.cos(Math.PI * (1 - p)), cy - rad * Math.sin(Math.PI * (1 - p))]
  let arcDelay = 0
  const arcs = GAUGE_BANDS.map((b) => {
    const st = pt(b[0], r)
    const en = pt(b[1], r)
    const len = Math.ceil(r * Math.PI * (b[1] - b[0])) + 1
    const dur = Math.round(1100 * (b[1] - b[0]))
    const a = {
      d: 'M' + st[0].toFixed(1) + ' ' + st[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + en[0].toFixed(1) + ' ' + en[1].toFixed(1),
      color: b[2],
      len,
      off: on ? 0 : len,
      dur,
      delay: arcDelay,
    }
    arcDelay += dur
    return a
  })
  const np = ease(clamp((t - L.chartAt - 500) / 1300)) * 0.38
  const n1 = pt(np, 92)
  const n2 = pt(np, 128)
  const ni = pt(np, 84)
  const needleO = f(L.chartAt + 400, 200)
  const bands = [
    { label: 'Low', range: '0-33%', color: '#D0302A', o: f(L.cardAt + 350) },
    { label: 'Medium', range: '34-65%', color: '#EFC15A', o: f(L.cardAt + 450) },
    { label: 'High', range: '66-100%', color: '#6BC966', o: f(L.cardAt + 550) },
  ]

  const plotW = 232
  const x0 = 97
  const hGrid = [0, 100, 200, 300, 400].map((v, i) => ({
    x: x0 + (i * plotW) / 4,
    lx: i === 0 ? x0 : i === 4 ? x0 + plotW - 40 : x0 + (i * plotW) / 4 - 20,
    align: (i === 0 ? 'left' : i === 4 ? 'right' : 'center') as CSSProperties['textAlign'],
    label: v + 'k',
    color: i === 0 ? c.axis : c.grid,
  }))
  const hBars = H_DATA.map((d, i) => ({ label: d[0], y: 12 + i * 46, ly: 17 + i * 46, w: on ? (d[1] / 400) * plotW : 0, delay: i * 110 }))

  const segPal = [c.s1, c.s2, c.s3, c.pink, c.orange, c.amber, c.teal, c.other]
  const sm = SEG_MONTHS[month]
  const sTot = sm.v.reduce((a, b) => a + b, 0)
  const segE = ease(clamp((t - L.chartAt) / 1200))
  const seg = {
    total: '$' + ((sTot * segE) / 1000).toFixed(2) + 'M',
    delta: (((sTot - sm.prev) / sm.prev) * 100).toFixed(2) + '%',
    parts: sm.v.map((v, i) => ({
      label: SEG_LABELS[i],
      color: segPal[i],
      value: '$' + v + 'K',
      pct: ((v / sTot) * 100).toFixed(2),
      g: on ? v : 0,
      delay: i * 90,
      o: f(L.chartAt + 300 + i * 60, 300),
    })),
    aria: 'Segmented bar: ' + sm.label + ' pipeline by source, ' + sm.v.map((v, i) => SEG_LABELS[i] + ' ' + ((v / sTot) * 100).toFixed(1) + '%').join(', '),
  }

  const stagePal = [c.s1, c.s2, c.s3, c.orange]
  const alloc = [
    { name: 'Enterprise', total: 714080, p: [41.2, 28.6, 18.7, 11.5], icon: c.s2, delay: 0 },
    { name: 'Mid-market', total: 514080, p: [37.15, 20.55, 21.2, 21.1], icon: c.s1, delay: 450 },
  ].map((g) => ({
    name: g.name,
    iconBg: g.icon,
    amount: '$' + Math.round(g.total * ease(clamp((t - L.chartAt - g.delay) / 1100))).toLocaleString('en-US'),
    o: f(L.chartAt - 250 + g.delay, 400),
    parts: g.p.map((p, i) => ({ label: STAGE_LABELS[i], color: stagePal[i], pct: p + '%', g: on ? p : 0, delay: g.delay + i * 100 })),
    aria: g.name + ' pipeline by stage: ' + g.p.map((p, i) => STAGE_LABELS[i] + ' ' + p + '%').join(', '),
  }))

  const gradPos = t < L.checkedAt ? 120 - ((t / 1800) % 1) * 220 : 0
  const shimPos = 120 - ((t / 1500) % 1) * 220
  const caretO = Math.floor(t / 530) % 2 === 0 ? 1 : 0

  const vars = {
    '--bg': c.bg,
    '--text': c.text,
    '--muted': c.muted,
    '--bubble': c.bubble,
    '--border': c.border,
    '--tile': c.tile,
    '--chip': c.chip,
    '--grid': c.grid,
    '--seg': c.seg,
    '--voice-bg': c.voiceBg,
    '--voice-fg': c.voiceFg,
    '--grad-end': c.gradEnd,
    '--s1': c.s1,
    '--panel': c.panel,
    '--pill': c.pill,
    '--up': c.up,
  } as CSSProperties

  const replay = () => setRun((n) => n + 1)

  return (
    <div className={s.root} style={vars} aria-hidden={decorative || undefined}>
      <header className={s.header}>
        <button type="button" aria-label="Close and replay" onClick={replay} tabIndex={tabIndex} className={`${s.iconBtn} ${s.close}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M19 5L5 19M5 5l14 14" />
          </svg>
        </button>
        <h1 className={s.thread}>{meta.thread}</h1>
        <button type="button" aria-label="Rename chat" tabIndex={tabIndex} className={s.iconBtn}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.3313 2.5C13.8313 2.50001 14.3064 2.69994 14.6564 3.04993L16.9623 5.36865C17.6873 6.0999 17.6873 7.28755 16.9623 8.0188L7.65015 17.3315C7.53145 17.4502 7.37507 17.5122 7.20642 17.5122L7.19971 17.5189H3.125C2.78131 17.5189 2.50009 17.2376 2.5 16.8939V12.8186C2.50004 12.6499 2.56881 12.4936 2.68127 12.3749L12.0062 3.04993C12.3625 2.69369 12.8313 2.5 13.3313 2.5ZM3.7439 13.075V16.2689H6.94397L14.278 8.93433L11.0809 5.7373L3.7439 13.075ZM13.3252 3.7561C13.1565 3.7561 13.0002 3.81874 12.8815 3.93738L11.9623 4.85596L15.1593 8.05298L16.0748 7.13745C16.3186 6.8937 16.3186 6.49985 16.0748 6.2561L13.7689 3.93738C13.6502 3.81867 13.4939 3.75615 13.3252 3.7561Z"
            />
          </svg>
        </button>
        <button type="button" aria-label="Chat history, new activity" tabIndex={tabIndex} className={s.iconBtn}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style={{ overflow: 'visible' }}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.75 4.375C14.7812 4.375 15.625 5.21875 15.625 6.25V12.5C15.625 13.5312 14.7812 14.375 13.75 14.375H6.50635L3.56262 17.3187C3.4445 17.4368 3.28297 17.4987 3.12134 17.4994C3.04133 17.499 2.96143 17.4869 2.88757 17.45C2.65632 17.3562 2.5 17.125 2.5 16.875V6.25C2.5 5.21875 3.34375 4.375 4.375 4.375H13.75ZM4.375 5.625C4.03125 5.625 3.75 5.90625 3.75 6.25V15.3687L5.80627 13.3124C5.92502 13.1937 6.08128 13.1311 6.25 13.1311H13.75C14.0938 13.1311 14.375 12.8499 14.375 12.5061V6.2561C14.3749 5.91242 14.0937 5.6311 13.75 5.6311H4.375V5.625Z"
            />
            <path d="M16.25 1.875C17.2812 1.875 18.125 2.71875 18.125 3.75V10C18.125 10.3438 17.8438 10.625 17.5 10.625C17.1562 10.625 16.875 10.3438 16.875 10V3.75C16.875 3.40625 16.5938 3.125 16.25 3.125H6.875C6.53125 3.125 6.25 2.84375 6.25 2.5C6.25 2.15625 6.53125 1.875 6.875 1.875H16.25Z" />
            <circle cx="17.2" cy="2.8" r="3" fill="#FF5C35" stroke={c.bg} strokeWidth="1.4" />
          </svg>
        </button>
        <button type="button" aria-label="More options" tabIndex={tabIndex} className={s.iconBtn}>
          <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <circle cx="10" cy="16.25" r="1.25" />
            <circle cx="10" cy="10" r="1.25" />
            <circle cx="10" cy="3.75" r="1.25" />
          </svg>
        </button>
      </header>

      <main className={s.main}>
        <div className={s.bubble}>{meta.prompt}</div>

        {t >= L.agentAt && (
          <div className={s.agent} style={{ opacity: o.agent }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF5C35" aria-hidden="true">
              <path d="M12 1c.8 5.6 5.4 10.2 11 11-5.6.8-10.2 5.4-11 11-.8-5.6-5.4-10.2-11-11C6.6 11.2 11.2 6.6 12 1z" />
            </svg>
            <span className={s.sending} style={{ backgroundPosition: `${gradPos.toFixed(1)}% 0` }}>
              {meta.sending}
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
              aria-hidden="true"
              className={s.chev}
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        )}

        <p className={s.intro}>
          <Words items={words(INTRO, L.introAt, t)} />
        </p>

        <div className={s.status}>
          {t >= L.checkAt && t < L.checkedAt && (
            <span className={s.shimmer} style={{ backgroundPosition: `${shimPos.toFixed(1)}% 0` }}>
              {meta.checking}
            </span>
          )}
          {t >= L.checkedAt && (
            <span className={s.checked} style={{ opacity: o.checked }}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
              {meta.checked}
            </span>
          )}
        </div>

        {t >= L.cardAt && (
          <article className={s.card} style={{ opacity: o.card, transform: `translateY(${o.cardY.toFixed(1)}px)` }}>
            <div className={s.cardHead}>
              <span className={s.tile}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
              <div className={s.cardTitles}>
                <span className={s.cardTitle}>{meta.title}</span>
                <span className={s.cardSub}>Chart artifact</span>
              </div>
              <span className={s.version}>v1</span>
            </div>

            <div className={s.cardBody}>
              <div className={s.chartTitleRow} style={{ opacity: o.i1 }}>
                <span className={s.chartTitle}>{meta.chartTitle}</span>
              </div>

              {chart !== 'segmented' && (
                <div className={s.chips} style={{ opacity: o.i2 }}>
                  <span className={s.chip}>
                    <span className={s.chipInner}>This year</span>
                  </span>
                  <span className={s.chip}>
                    <span className={s.chipInner}>
                      Filter:&nbsp;<strong>1</strong>
                    </span>
                  </span>
                </div>
              )}

              {chart === 'stacked' && (
                <div>
                  <div role="tablist" aria-label="Group by" className={s.segControl} style={{ opacity: o.i3 }}>
                    {STACK_SETS.map((item, i) => {
                      const sel = i === tab
                      return (
                        <button
                          key={item.label}
                          type="button"
                          role="tab"
                          aria-selected={sel}
                          tabIndex={tabIndex}
                          onClick={() => setTab(i)}
                          className={s.tab}
                          style={{ background: sel ? '#0B4D4F' : 'transparent', color: sel ? '#FFFFFF' : c.text }}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className={s.legend} style={{ opacity: o.i4 }}>
                    {set.series.map((label, i) => (
                      <span key={label} className={s.legendItem}>
                        <span className={s.dot9} style={{ background: series[i] }} />
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className={s.axisTitle} style={{ opacity: o.i4 }}>
                    Contacts (count)
                  </div>

                  <div role="img" aria-label={stackAria} className={s.plot}>
                    <div style={{ opacity: o.i5 }}>
                      {sGrid.map((g) => (
                        <div key={g.label}>
                          <div className={s.gridLine} style={{ top: g.y, background: g.color }} />
                          <span className={s.gridLabel} style={{ top: g.ly }}>
                            {g.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className={s.barsGrid}>
                      {bars.map((segs, bi) => (
                        <div key={bi} className={s.barCol}>
                          {segs.map((sg, si) => (
                            <div key={si} className={s.barSeg} style={{ height: sg.h, background: sg.color, transitionDelay: `${sg.delay}ms` }} />
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className={s.months} style={{ opacity: o.i5 }}>
                      {MONTHS.map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                    <div className={s.xTitle} style={{ opacity: o.i5 }}>
                      Month
                    </div>
                  </div>
                </div>
              )}

              {chart === 'gauge' && (
                <div>
                  <div className={s.bands}>
                    {bands.map((item) => (
                      <div key={item.label} className={s.band} style={{ opacity: item.o }}>
                        <span className={s.bandLabel}>
                          <span className={s.dot10} style={{ background: item.color }} />
                          {item.label}
                        </span>
                        <span className={s.mono12}>{item.range}</span>
                      </div>
                    ))}
                  </div>

                  <div role="img" aria-label="Gauge: brand visibility 38 percent, in the medium band, up 34 percent" className={s.gauge}>
                    <svg width="330" height="214" viewBox="0 0 330 214" aria-hidden="true" className={s.gaugeSvg}>
                      {arcs.map((a) => (
                        <path
                          key={a.color}
                          d={a.d}
                          fill="none"
                          stroke={a.color}
                          strokeWidth="30"
                          style={{
                            strokeDasharray: a.len,
                            strokeDashoffset: a.off,
                            transition: `stroke-dashoffset ${a.dur}ms linear ${a.delay}ms`,
                          }}
                        />
                      ))}
                      <line
                        x1={n1[0].toFixed(1)}
                        y1={n1[1].toFixed(1)}
                        x2={n2[0].toFixed(1)}
                        y2={n2[1].toFixed(1)}
                        stroke={c.bg}
                        strokeWidth="6"
                        style={{ opacity: needleO }}
                      />
                      <line
                        x1={ni[0].toFixed(1)}
                        y1={ni[1].toFixed(1)}
                        x2={n2[0].toFixed(1)}
                        y2={n2[1].toFixed(1)}
                        stroke={c.text}
                        strokeWidth="1.4"
                        style={{ opacity: needleO }}
                      />
                    </svg>
                    <div className={s.mono12} style={{ opacity: o.i5 }}>
                      <span className={s.abs} style={{ left: 14, top: 172 }}>
                        0%
                      </span>
                      <span className={s.abs} style={{ left: 72, top: 44 }}>
                        33%
                      </span>
                      <span className={s.abs} style={{ left: 233, top: 44 }}>
                        66%
                      </span>
                      <span className={s.abs} style={{ left: 292, top: 172 }}>
                        100%
                      </span>
                    </div>
                    <div className={`${s.bigNum} ${s.gaugeNum}`}>{Math.round(np * 100)}%</div>
                    <div className={s.gaugeMeta} style={{ opacity: o.i6 }}>
                      <span className={s.gaugeDelta}>
                        <svg width="11" height="8" viewBox="0 0 12 9" aria-hidden="true">
                          <path d="M6 0l6 9H0z" fill="#3DAE5A" />
                        </svg>
                        34%
                      </span>
                      <span>3.8/12u</span>
                    </div>
                  </div>
                </div>
              )}

              {chart === 'bars' && (
                <div>
                  <div className={s.legendRow} style={{ opacity: o.i3 }}>
                    <span className={s.legendItem}>
                      <span className={s.dot9} style={{ background: c.s1 }} />
                      Pipeline contribution
                    </span>
                  </div>
                  <div className={s.axisTitle} style={{ opacity: o.i4 }}>
                    Source
                  </div>
                  <div
                    role="img"
                    aria-label="Horizontal bar chart: techradar.com about 255k, zoho.com 176k, salesforce.com 133k, hubspot.com 58k"
                    className={s.plot}
                  >
                    <div style={{ opacity: o.i5 }}>
                      {hGrid.map((g) => (
                        <div key={g.label}>
                          <div className={s.hGridLine} style={{ left: g.x, background: g.color }} />
                          <span className={s.hGridLabel} style={{ left: g.lx, textAlign: g.align }}>
                            {g.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    {hBars.map((b) => (
                      <div key={b.label}>
                        <span className={s.hLabel} style={{ top: b.ly, opacity: o.i5 }}>
                          {b.label}
                        </span>
                        <div className={s.hBar} style={{ top: b.y, width: b.w, transitionDelay: `${b.delay}ms` }} />
                      </div>
                    ))}
                    <div className={s.hTitle} style={{ opacity: o.i5 }}>
                      Contacts (k)
                    </div>
                  </div>
                </div>
              )}

              {chart === 'segmented' && (
                <div>
                  <div className={s.monthRow} style={{ opacity: o.i2 }}>
                    <div role="tablist" aria-label="Month" className={s.monthSeg}>
                      {SEG_MONTHS.map((m, i) => {
                        const sel = i === month
                        return (
                          <button
                            key={m.label}
                            type="button"
                            role="tab"
                            aria-selected={sel}
                            tabIndex={tabIndex}
                            onClick={() => setMonth(i)}
                            className={s.monthTab}
                            style={{ background: sel ? '#0B4D4F' : 'transparent', color: sel ? '#FFFFFF' : c.text }}
                          >
                            {m.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className={s.totalLabel} style={{ opacity: o.i3 }}>
                    Total pipeline
                  </div>
                  <div className={s.totalRow} style={{ opacity: o.i3 }}>
                    <span className={s.bigNum}>{seg.total}</span>
                    <span className={s.delta}>
                      <svg width="11" height="8" viewBox="0 0 12 9" aria-hidden="true">
                        <path d="M6 0l6 9H0z" fill="currentColor" />
                      </svg>
                      {seg.delta}
                    </span>
                  </div>
                  <p className={s.segText} style={{ opacity: o.i4 }}>
                    The top 4 sources this month are <span className={s.hl}>inbound-led</span>, highlighting how much{' '}
                    <span className={s.mk}>marketing</span> is driving <span className={s.hl}>pipeline growth</span>.
                  </p>

                  <div role="img" aria-label={seg.aria} className={s.segBar} style={{ opacity: o.i5 }}>
                    {seg.parts.map((p) => (
                      <div key={p.label} className={s.segPart} style={{ flex: `${p.g} 1 0px`, background: p.color, transitionDelay: `${p.delay}ms` }} />
                    ))}
                  </div>

                  <div className={s.segPanel}>
                    {seg.parts.map((p) => (
                      <div key={p.label} className={s.segItem} style={{ opacity: p.o }}>
                        <span className={s.segRule} style={{ background: p.color }} />
                        <span className={s.segInfo}>
                          <span className={s.ellipsis}>{p.label}</span>
                          <span className={s.segValue}>{p.value}</span>
                        </span>
                        <span className={s.pill}>{p.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {chart === 'allocation' && (
                <div className={s.alloc}>
                  {alloc.map((g) => (
                    <div key={g.name} style={{ opacity: g.o }}>
                      <div className={s.allocName}>
                        {g.name}
                        <span className={s.allocIcon} style={{ background: g.iconBg }}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M4 21V5l8-3v19M12 9l8 3v9M2 21h20" />
                          </svg>
                        </span>
                      </div>
                      <div className={`${s.bigNum} ${s.allocAmount}`}>{g.amount}</div>
                      <div role="img" aria-label={g.aria} className={s.allocBar}>
                        {g.parts.map((p) => (
                          <div key={p.label} className={s.allocPart} style={{ flex: `${p.g} 1 0px`, background: p.color, transitionDelay: `${p.delay}ms` }} />
                        ))}
                      </div>
                      <div className={s.allocLegend}>
                        {g.parts.map((p) => (
                          <span key={p.label} className={s.allocItem}>
                            <span className={s.dot10} style={{ background: p.color }} />
                            <span className={s.muted}>{p.label}</span>
                            <span className={s.mono12}>{p.pct}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        )}

        <p className={s.reply}>
          <Words items={words(REPLIES[chart], L.replyAt, t)} />
        </p>

        {t >= L.footAt && (
          <div>
            <p className={s.disclaimer} style={{ opacity: o.foot[0] }}>
              AI-generated content may be inaccurate
            </p>
            <div className={s.actions}>
              <button type="button" aria-label="Share" tabIndex={tabIndex} className={s.actBtn} style={{ opacity: o.foot[1] }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 9H5v12h14V9h-3" />
                  <path d="M12 15V3M8 7l4-4 4 4" />
                </svg>
              </button>
              <button type="button" aria-label="Copy" tabIndex={tabIndex} className={s.actBtn} style={{ opacity: o.foot[2] }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="8" y="8" width="13" height="13" rx="2" strokeDasharray="3 2.5" />
                  <path d="M16 4H5a2 2 0 0 0-2 2v10" />
                </svg>
              </button>
              <button type="button" aria-label="Good response" tabIndex={tabIndex} className={s.actBtn} style={{ opacity: o.foot[3] }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 10v11H3V10z" />
                  <path d="M7 10l4-8a3 3 0 0 1 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.4 7.5a2 2 0 0 1-2 1.7H7" />
                </svg>
              </button>
              <button type="button" aria-label="Bad response" tabIndex={tabIndex} className={s.actBtn} style={{ opacity: o.foot[4] }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 14V3h4v11z" />
                  <path d="M17 14l-4 8a3 3 0 0 1-3-3v-4H4.5a2 2 0 0 1-2-2.3l1.4-7.5a2 2 0 0 1 2-1.7H17" />
                </svg>
              </button>
              <button type="button" aria-label="Report a problem" tabIndex={tabIndex} className={s.actBtn} style={{ opacity: o.foot[5] }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 3l18 18" />
                  <path d="M8 8a4 4 0 0 0-1 3v3a5 5 0 0 0 9 3M17 13v-2a5 5 0 0 0-7.5-4.3" />
                  <path d="M3 12h4M17 12h4M5 19l2.5-2M19 5l-2 2M5 5l2 2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      <div className={s.composer}>
        <div className={s.inputRow}>
          <span aria-hidden="true" className={s.caret} style={{ opacity: caretO }} />
          <label htmlFor={inputId} className={s.srOnly}>
            Message Breeze Assistant
          </label>
          <input id={inputId} placeholder="Ask Breeze Assistant anything..." tabIndex={tabIndex} className={s.input} />
        </div>
        <div className={s.tools}>
          <button type="button" aria-label="Add attachment" tabIndex={tabIndex} className={s.round}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M12 4v16M4 12h16" />
            </svg>
          </button>
          <span className={s.spacer} />
          <button type="button" aria-label="Dictate" tabIndex={tabIndex} className={s.round}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
            </svg>
          </button>
          <button type="button" aria-label="Start voice conversation" tabIndex={tabIndex} className={`${s.round} ${s.voice}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
