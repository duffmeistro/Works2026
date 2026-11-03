import { useEffect, useMemo, useRef, useState } from 'react'
import s from './PlanBuilder.module.css'

/*
  Plan Builder — Playground piece
  A mobile quote builder: tap packages to build a plan. Each tile's area is in
  proportion to its monthly cost, and the total at the top counts up or down
  as packages are added or removed.
*/

type Item = { id: string; name: string; detail: string; price: number }
type Size = 'lg' | 'md' | 'sm'
type Cell = { item: Item; x: number; y: number; w: number; h: number; size: Size }
type Area = Item & { area: number }
type Rect = { x: number; y: number; w: number; h: number }

// Placeholder pricing for the concept — not real list prices.
const CATALOG: Item[] = [
  { id: 'sales', name: 'Sales Hub', detail: 'Pro · 5 seats', price: 500 },
  { id: 'service', name: 'Service Hub', detail: 'Pro · 3 seats', price: 300 },
  { id: 'content', name: 'Content Hub', detail: 'Pro · CMS', price: 250 },
  { id: 'commerce', name: 'Commerce Hub', detail: 'Payments & quotes', price: 150 },
  { id: 'data', name: 'Data Hub', detail: 'Sync & quality', price: 120 },
  { id: 'support', name: 'Priority support', detail: 'Phone & chat', price: 110 },
  { id: 'ai', name: 'Breeze AI', detail: 'Credits pack', price: 90 },
  { id: 'objects', name: 'Custom objects', detail: 'Pro add-on', price: 80 },
  { id: 'sandbox', name: 'Sandboxes', detail: 'Dev & test', price: 70 },
  { id: 'reports', name: 'Reporting', detail: 'Custom reports', price: 65 },
  { id: 'crm', name: 'CRM seats', detail: '+10 core', price: 60 },
  { id: 'mobile', name: 'Mobile', detail: 'Field sales', price: 50 },
  { id: 'calling', name: 'Calling', detail: '+3k minutes', price: 40 },
  { id: 'api', name: 'API limit', detail: '+1M calls', price: 35 },
  { id: 'transcribe', name: 'Transcripts', detail: 'Call notes', price: 25 },
]

const BANDS = [
  ['support', 'objects', 'crm', 'mobile'],
  ['sales', 'ai', 'api'],
  ['content', 'data', 'sandbox', 'transcribe'],
  ['service', 'commerce', 'reports', 'calling'],
]

const START = ['sales', 'commerce', 'mobile', 'crm']
const MAP_W = 358
const GAP = 4
const COUNT_MS = 480
const PRESS_DELAY = 180

// Demo: [ms before the tap, tile]. Each tile is tapped twice, so the loop ends on the starting plan.
const DEMO: [number, string][] = [
  [1200, 'support'],
  [1100, 'objects'],
  [1100, 'crm'],
  [1700, 'support'],
  [1100, 'objects'],
  [1100, 'crm'],
]

const byId = Object.fromEntries(CATALOG.map((it) => [it.id, it]))
const fmt = (n: number) => '$' + n.toLocaleString('en-US')
const totalFor = (sel: ReadonlySet<string>) => CATALOG.reduce((sum, it) => sum + (sel.has(it.id) ? it.price : 0), 0)

function squarify(items: Area[], rect: Rect) {
  const out: { item: Area; x: number; y: number; w: number; h: number }[] = []
  const r = { ...rect }
  const worst = (row: Area[], len: number) => {
    if (!row.length) return Infinity
    let sum = 0
    let mx = 0
    let mn = Infinity
    row.forEach((it) => {
      sum += it.area
      mx = Math.max(mx, it.area)
      mn = Math.min(mn, it.area)
    })
    return Math.max((len * len * mx) / (sum * sum), (sum * sum) / (len * len * mn))
  }
  const place = (row: Area[]) => {
    const sum = row.reduce((a, it) => a + it.area, 0)
    if (r.w >= r.h) {
      const cw = sum / r.h
      let yy = r.y
      row.forEach((it) => {
        const hh = it.area / cw
        out.push({ item: it, x: r.x, y: yy, w: cw, h: hh })
        yy += hh
      })
      r.x += cw
      r.w -= cw
    } else {
      const rh = sum / r.w
      let xx = r.x
      row.forEach((it) => {
        const ww = it.area / rh
        out.push({ item: it, x: xx, y: r.y, w: ww, h: rh })
        xx += ww
      })
      r.y += rh
      r.h -= rh
    }
  }
  const queue = items.slice()
  let row: Area[] = []
  while (queue.length) {
    const len = Math.min(r.w, r.h)
    const c = queue[0]
    if (!row.length || worst([...row, c], len) <= worst(row, len)) {
      row.push(c)
      queue.shift()
    } else {
      place(row)
      row = []
    }
  }
  if (row.length) place(row)
  return out
}

function buildLayout() {
  const bw = MAP_W + GAP * 2
  const k = 170
  const cells: Cell[] = []
  let y = -GAP
  BANDS.forEach((ids, bi) => {
    const its = ids
      .map((id) => byId[id])
      .sort((a, b) => b.price - a.price)
      .map((it) => ({ ...it, area: it.price * k }))
    const bh = its.reduce((sum, it) => sum + it.area, 0) / bw
    const rs = squarify(its, { x: -GAP, y, w: bw, h: bh })
    if (bi % 2 === 1) rs.forEach((rc) => (rc.x = bw - (rc.x + GAP) - rc.w - GAP))
    rs.forEach((rc) => {
      const w = rc.w - GAP * 2
      const h = rc.h - GAP * 2
      const size: Size = w >= 150 && h >= 120 ? 'lg' : w < 96 || h < 80 ? 'sm' : 'md'
      cells.push({ item: byId[rc.item.id], x: Math.round(rc.x + GAP), y: Math.round(rc.y + GAP), w: Math.round(w), h: Math.round(h), size })
    })
    y += bh
  })
  return { cells, height: Math.round(y - GAP) }
}

const LAYOUT = buildLayout()

const Tick = () => (
  <svg className={s.tick} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

type PlanBuilderProps = {
  theme?: 'dark' | 'light'
  /** Tap a few packages on and off on a loop, without input. */
  demo?: boolean
  className?: string
}

export default function PlanBuilder({ theme = 'dark', demo = false, className }: PlanBuilderProps) {
  const [sel, setSel] = useState<ReadonlySet<string>>(() => new Set(START))
  const total = useMemo(() => totalFor(sel), [sel])
  const [shown, setShown] = useState(total)
  const shownRef = useRef(total)
  const phoneRef = useRef<HTMLDivElement>(null)
  const tapRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const from = shownRef.current
    if (from === total) return
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS)
      const v = Math.round(from + (total - from) * (1 - Math.pow(1 - p, 3)))
      shownRef.current = v
      setShown(v)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [total])

  const toggle = (id: string) =>
    setSel((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const showTap = (id: string) => {
    const el = tileRefs.current[id]
    const dot = tapRef.current
    const phone = phoneRef.current
    if (!el || !dot || !phone) return
    const pr = phone.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const k = pr.width / phone.offsetWidth || 1
    dot.style.left = `${(r.left - pr.left) / k + (r.width / k) * 0.5}px`
    dot.style.top = `${(r.top - pr.top) / k + (r.height / k) * 0.55}px`
    dot.animate(
      [
        { opacity: 0, transform: 'scale(0.6)' },
        { opacity: 1, transform: 'scale(1)', offset: 0.3 },
        { opacity: 0, transform: 'scale(1.3)' },
      ],
      { duration: 700, easing: 'ease-out' },
    )
  }

  useEffect(() => {
    if (!demo) return
    setSel(new Set(START))
    let step = 0
    let wait = 0
    let press = 0
    const run = () => {
      const [delay, id] = DEMO[step]
      wait = window.setTimeout(() => {
        showTap(id)
        press = window.setTimeout(() => toggle(id), PRESS_DELAY)
        step = (step + 1) % DEMO.length
        run()
      }, delay)
    }
    run()
    return () => {
      window.clearTimeout(wait)
      window.clearTimeout(press)
    }
  }, [demo])

  return (
    <div ref={phoneRef} className={[s.root, theme === 'light' ? s.light : '', className].filter(Boolean).join(' ')}>
      <div className={s.status}>
        <span className={s.time}>9:41</span>
        <div className={s.island} aria-hidden="true">
          <i />
        </div>
        <div className={s.icons} aria-hidden="true">
          <svg width="18" height="12" viewBox="0 0 18 12">
            <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
            <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
            <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12">
            <path d="M8 11.2l2.2-2.4a3.2 3.2 0 0 0-4.4 0z M3.6 6.6a6.3 6.3 0 0 1 8.8 0l1.4-1.5a8.4 8.4 0 0 0-11.6 0z M0.8 3.6a10.3 10.3 0 0 1 14.4 0L16 2.6a11.8 11.8 0 0 0-16 0z" fill="currentColor" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13">
            <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.45" />
            <rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor" />
            <path d="M25 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" fillOpacity="0.45" />
          </svg>
        </div>
      </div>

      <div className={s.scroller}>
        <header className={s.header}>
          <div className={s.heading}>
            <span className={s.eyebrow}>Quote builder</span>
            <span className={s.client}>Atomic Inc.</span>
          </div>
          <button className={s.iconBtn} type="button" aria-label="Clear selection" onClick={() => setSel(new Set())}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
          </button>
        </header>

        <section className={s.total} aria-live="polite">
          <div className={s.row}>
            <div>
              <span className={s.label}>Monthly total</span>
              <span className={s.big}>{fmt(shown)}</span>
            </div>
            <div className={s.perYear}>
              <span className={s.label}>Per year</span>
              <span className={s.year}>{fmt(shown * 12)}</span>
            </div>
          </div>
          <div>
            <div className={s.segs}>
              {LAYOUT.cells.map(({ item }) => (
                <div key={item.id} style={{ flex: `${item.price} 1 0`, background: sel.has(item.id) ? '#140A04' : 'rgba(20,10,4,0.18)' }} />
              ))}
            </div>
            <div className={s.meta}>
              <span>
                {sel.size} of {CATALOG.length} packages
              </span>
              <span>Billed monthly · USD</span>
            </div>
          </div>
        </section>

        <div className={s.section}>
          <b>Packages</b>
          <span>Tile size = monthly cost</span>
        </div>
        <div className={s.map} style={{ height: LAYOUT.height }}>
          {LAYOUT.cells.map(({ item, x, y, w, h, size }) => {
            const on = sel.has(item.id)
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tileRefs.current[item.id] = el
                }}
                type="button"
                className={[s.tile, s[size], on ? s.on : ''].filter(Boolean).join(' ')}
                style={{ left: x, top: y, width: w, height: h }}
                aria-label={`${item.name}, ${item.detail}, ${fmt(item.price)} per month`}
                aria-pressed={on}
                onClick={() => toggle(item.id)}
              >
                {size === 'sm' ? (
                  <>
                    <span className={s.name}>{item.name}</span>
                    <span className={s.price}>{fmt(item.price)}</span>
                  </>
                ) : (
                  <>
                    <div>
                      <div className={s.name}>{item.name}</div>
                      <div className={s.sub}>{item.detail}</div>
                    </div>
                    <div className={s.foot}>
                      {size === 'md' && <span className={s.price}>{fmt(item.price)}</span>}
                      <Tick />
                    </div>
                  </>
                )}
              </button>
            )
          })}
        </div>
        <div className={s.spacer} />
      </div>

      <div className={s.scrim} aria-hidden="true" />
      <div className={s.ctaWrap}>
        <button className={s.cta} type="button">
          <span>Review quote</span>
          <span className={s.dot}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
      </div>
      <div className={s.home} aria-hidden="true" />
      <div ref={tapRef} className={s.tap} aria-hidden="true" />
    </div>
  )
}
