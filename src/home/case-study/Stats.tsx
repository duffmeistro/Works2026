import type { CSSProperties } from 'react'
import { useLive } from './primitives'
import styles from './Stats.module.css'

type Kind = 'ghost' | 'ink' | 'acc'
type Dot = { kind: Kind; x: number; y: number; delay?: number }

const W = 320
const H = 184

function circle(): Dot[] {
  const ring: { x: number; y: number }[] = []
  for (let k = 0; k <= 8; k++) {
    const r = (k * 85) / 8
    const n = k === 0 ? 1 : Math.round((2 * Math.PI * r) / 10)
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n
      ring.push({ x: 156.5 + r * Math.cos(a), y: 92 + r * Math.sin(a) })
    }
  }
  const ghosts = ring.map((p): Dot => ({ kind: 'ghost', ...p }))
  const ink = ring.slice(0, 37).map((p, i): Dot => ({ kind: 'ink', ...p, delay: (i * 2.53) / 36 }))
  return [...ghosts, ...ink]
}

function grid(): Dot[] {
  const acc: Dot[] = []
  const ghosts: Dot[] = []
  for (let i = 0; i < 360; i++) {
    const x = 61.5 + (i % 20) * 10
    const y = 177 - Math.floor(i / 20) * 10
    if (i < 62) acc.push({ kind: 'acc', x, y, delay: i / 120 })
    else ghosts.push({ kind: 'ghost', x, y })
  }
  return [...acc, ...ghosts]
}

function stacks(): Dot[] {
  const dots: Dot[] = []
  const spec = [
    [8, 0],
    [8, 4],
    [12, 6],
  ]
  spec.forEach(([ink, acc], s) => {
    for (let r = 0; r < 18; r++) {
      for (let c = 0; c < 4; c++) {
        const x = 67.5 + s * 74 + c * 10
        const y = 177 - r * 10
        const delay = s * 0.7 + r * 0.09 + c * 0.04
        if (r < ink) dots.push({ kind: 'ink', x, y, delay })
        else if (r < ink + acc) dots.push({ kind: 'acc', x, y, delay })
        else dots.push({ kind: 'ghost', x, y })
      }
    }
  })
  return dots
}

const STATS = [
  {
    dots: circle(),
    label:
      'A full circle of 241 grey dots with the centre 37 in black, growing outward: Voice AI users are about 15 percent of Breeze AI users',
    num: '8.1k',
    cap: 'Voice AI MAUs, about 15% of Breeze AI users (Nov 2026)',
  },
  {
    dots: grid(),
    label: 'Grid of 360 dots with 62 in orange and the rest in grey: 52,300 Breeze AI users out of 302,000 app users, about 17 percent',
    num: '52.3k',
    cap: 'Breeze AI MAUs, of 302k total Breeze app users (Nov 2026)',
  },
  {
    dots: stacks(),
    label: 'Three vertical dot stacks, each 50 percent taller than the one before, the growth on each shown in orange',
    num: '+51%',
    cap: 'Month on month growth in Breeze AI visits (since Aug 2026)',
  },
]

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`

function DotViz({ dots, label, live }: { dots: Dot[]; label: string; live: boolean }) {
  return (
    <div className={styles.viz} role="img" aria-label={label}>
      {dots.map((d, i) => (
        <div
          key={i}
          className={`${styles.dot} ${styles[d.kind]}${live && d.delay !== undefined ? ` ${styles.on}` : ''}`}
          style={
            {
              left: pct(d.x, W),
              top: pct(d.y, H),
              animationDelay: d.delay !== undefined ? `${d.delay.toFixed(2)}s` : undefined,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function Stats() {
  const [ref, live] = useLive<HTMLElement>()
  return (
    <section ref={ref} className={styles.stats}>
      {STATS.map((s) => (
        <div key={s.num} className={styles.stat}>
          <DotViz dots={s.dots} label={s.label} live={live} />
          <div className={styles.num}>{s.num}</div>
          <div className={styles.cap}>{s.cap}</div>
        </div>
      ))}
    </section>
  )
}
