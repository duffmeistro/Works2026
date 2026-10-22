export type BarRow = { label: string; cols: number; accent?: 'last' | number }

export type ChartSpec =
  | { kind: 'ring'; pct: number }
  | { kind: 'bars'; rows: BarRow[] }
  | { kind: 'share'; n: number; total: number; cols: number; note: string }
  | { kind: 'pair'; a: number; b: number; labelA: string; labelB: string }
  | { kind: 'waffle'; n: number; total: number; note: string }
  | { kind: 'discs'; k: number; labelA: string; labelB: string }

export type DotKind = 'ghost' | 'ink' | 'accent' | 'halo'

export type Dot = {
  x: number
  y: number
  d: number
  kind: DotKind
  alpha?: number
  delay?: number
}

export type ChartLabel = { text: string; x: number; y: number }

export type ChartGeometry = { dots: Dot[]; labels: ChartLabel[] }

export const CHART_W = 320
export const CHART_H = 184

const W = CHART_W
const H = CHART_H

function lit(dots: Dot[], x: number, y: number, d: number, accent: boolean, delay: number) {
  dots.push({ x, y, d, kind: accent ? 'accent' : 'ink', delay })
}

function bars(rows: BarRow[]): ChartGeometry {
  const dots: Dot[] = []
  const labels: ChartLabel[] = []
  const slot = H / rows.length
  const lines = rows.length === 2 ? 3 : 2
  const pitch = 9.7
  rows.forEach((r, ri) => {
    const top = slot * ri + 2
    labels.push({ text: r.label, x: 0, y: top })
    for (let L = 0; L < lines; L++) {
      const y = top + 30 + L * 10
      for (let c = 0; c < 32; c++) {
        const x = 6 + c * pitch
        dots.push({ x, y, d: 2.6, kind: 'ghost' })
        if (c < r.cols) {
          const accent = r.accent === 'last' ? c === Math.ceil(r.cols) - 1 : typeof r.accent === 'number' && c >= r.accent
          lit(dots, x, y, 7, accent, ri * 0.7 + c * 0.06 + L * 0.04)
        }
      }
    }
  })
  return { dots, labels }
}

function waffle(n: number, total: number, note: string): ChartGeometry {
  const dots: Dot[] = []
  const cols = 20
  const rows = Math.ceil(total / cols)
  const top = 26
  const avail = H - top
  const pitch = Math.min(16, avail / rows)
  const d = Math.min(9, pitch * 0.62)
  const ox = (W - cols * 16) / 2 + 8
  for (let i = 0; i < rows * cols; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    const x = ox + c * 16
    const y = top + avail - pitch / 2 - r * pitch
    dots.push({ x, y, d, kind: 'ghost' })
    if (i < n) lit(dots, x, y, d, i === n - 1, (i / n) * 3)
  }
  return { dots, labels: [{ text: note, x: 0, y: 0 }] }
}

function ring(pct: number): ChartGeometry {
  const dots: Dot[] = []
  const cx = 160
  const cy = 92
  const R = 76
  const n = 46
  const on = Math.round(n * pct)
  for (let k = 1; k <= 6; k++) {
    const rad = k * 10.5
    const m = Math.max(6, Math.round((2 * Math.PI * rad) / 10.5))
    for (let q = 0; q < m; q++) {
      const t = -Math.PI / 2 + (2 * Math.PI * q) / m
      dots.push({
        x: cx + rad * Math.cos(t),
        y: cy + rad * Math.sin(t),
        d: 2.6,
        kind: 'halo',
        alpha: Math.max(0.08, 0.38 * (1 - k / 8)),
      })
    }
  }
  for (let j = 0; j < n; j++) {
    const t = -Math.PI / 2 + (2 * Math.PI * j) / n
    const x = cx + R * Math.cos(t)
    const y = cy + R * Math.sin(t)
    dots.push({ x, y, d: 8, kind: 'ghost' })
    if (j < on) lit(dots, x, y, 8, j === on - 1, (j / on) * 2.6)
  }
  return { dots, labels: [] }
}

function discs(k: number, labelA: string, labelB: string): ChartGeometry {
  const dots: Dot[] = []
  const pitch = 9
  const d = 6
  const cy = 108
  const r1 = 46
  const r2 = r1 * Math.sqrt(k)
  const c1 = 50
  const c2 = 314 - r2
  const disc = (cx: number, R: number, inner: number | null, base: number) => {
    const span = Math.ceil(R / (pitch * 0.866))
    for (let row = -span; row <= span; row++) {
      const y = cy + row * pitch * 0.866
      const off = row & 1 ? pitch / 2 : 0
      for (let x = cx - R - pitch + off; x <= cx + R + pitch; x += pitch) {
        const dist = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy))
        if (dist > R - d / 2) continue
        dots.push({ x, y, d: 2.6, kind: 'ghost' })
        lit(dots, x, y, d, inner !== null && dist > inner, base + (dist / R) * 1.6)
      }
    }
  }
  disc(c1, r1, null, 0)
  disc(c2, r2, r1, 0.9)
  return {
    dots,
    labels: [
      { text: labelA, x: 0, y: 0 },
      { text: labelB, x: Math.round(c2 - r2), y: 0 },
    ],
  }
}

function share(n: number, total: number, cols: number, note: string): ChartGeometry {
  const dots: Dot[] = []
  const rows = Math.ceil(total / cols)
  const top = 26
  const pitch = Math.min(16, (H - top) / rows)
  const d = Math.min(10, pitch * 0.66)
  const ox = (W - (cols - 1) * pitch) / 2
  for (let i = 0; i < total; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    const x = ox + c * pitch
    const y = top + pitch / 2 + r * pitch
    dots.push({ x, y, d, kind: 'ghost' })
    if (i < n) lit(dots, x, y, d, true, i * 0.22)
  }
  return { dots, labels: [{ text: note, x: 0, y: 0 }] }
}

function pair(a: number, b: number, labelA: string, labelB: string): ChartGeometry {
  const dots: Dot[] = []
  const labels: ChartLabel[] = []
  const cols = 8
  const pitch = 14
  const d = 8
  const top = 26
  const rows = Math.ceil(Math.max(a, b) / cols)
  const gap = 40
  const bw = (cols - 1) * pitch
  const ox = (W - (bw * 2 + gap)) / 2
  ;[a, b].forEach((n, k) => {
    const x0 = ox + k * (bw + gap)
    for (let i = 0; i < rows * cols; i++) {
      const r = Math.floor(i / cols)
      const c = i % cols
      const x = x0 + c * pitch
      const y = H - pitch / 2 - r * pitch
      if (y < top) continue
      dots.push({ x, y, d: 3, kind: 'ghost' })
      if (i < n) lit(dots, x, y, d, k === 1 && i >= a, (i / n) * 2.4 + k * 0.3)
    }
    labels.push({ text: k ? labelB : labelA, x: Math.round(x0 - d / 2), y: Math.max(0, Math.round(H - rows * pitch - 26)) })
  })
  return { dots, labels }
}

export function buildChart(spec: ChartSpec): ChartGeometry {
  switch (spec.kind) {
    case 'ring':
      return ring(spec.pct)
    case 'bars':
      return bars(spec.rows)
    case 'share':
      return share(spec.n, spec.total, spec.cols, spec.note)
    case 'pair':
      return pair(spec.a, spec.b, spec.labelA, spec.labelB)
    case 'waffle':
      return waffle(spec.n, spec.total, spec.note)
    case 'discs':
      return discs(spec.k, spec.labelA, spec.labelB)
  }
}
