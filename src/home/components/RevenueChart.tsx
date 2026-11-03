/**
 * RevenueChart — animated mobile revenue screen (Playground piece)
 *
 * Self-contained: no dependencies beyond React. Drop it into a Next.js
 * page and render <RevenueChart /> or <RevenueChart theme="dark" />.
 * Styles are scoped with an `rc-` prefix.
 *
 * Interactions
 *  - Bars grow upward with a staggered ease when the phone scrolls into view
 *  - Tap a bar → bottom sheet slides up with that month's detail
 *  - Close via the X, tapping the dimmed backdrop, or Escape
 *  - Replay button re-runs the bar animation
 *
 * Props
 *  - theme:       'light' (sage, default) or 'dark'
 *  - data:        array of { short, full, yr, v (revenue in €k), d (deals) }
 *  - accent:      colour for the best month's bar (default orange)
 *  - showIsland:  render the Dynamic Island pill (default true)
 */

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

type Month = { short: string; full: string; yr: number; v: number; d: number };

type RevenueChartProps = {
  theme?: 'light' | 'dark';
  data?: Month[];
  accent?: string;
  showIsland?: boolean;
  /** Change this to replay the bar animation from outside. */
  replayKey?: number;
};

const DEFAULT_DATA: Month[] = [
  { short: 'Nov', full: 'November', yr: 2025, v: 39.5, d: 28 },
  { short: 'Dec', full: 'December', yr: 2025, v: 33.2, d: 24 },
  { short: 'Jan', full: 'January', yr: 2026, v: 22.7, d: 17 },
  { short: 'Feb', full: 'February', yr: 2026, v: 35.9, d: 26 },
  { short: 'Mar', full: 'March', yr: 2026, v: 48.2, d: 34 },
  { short: 'Apr', full: 'April', yr: 2026, v: 27.9, d: 21 },
  { short: 'May', full: 'May', yr: 2026, v: 81.6, d: 52 },
  { short: 'Jun', full: 'June', yr: 2026, v: 44.1, d: 31 },
  { short: 'Jul', full: 'July', yr: 2026, v: 54.8, d: 38 },
  { short: 'Aug', full: 'August', yr: 2026, v: 47.6, d: 33 },
  { short: 'Sep', full: 'September', yr: 2026, v: 11.4, d: 9 },
  { short: 'Oct', full: 'October', yr: 2026, v: 26.3, d: 19 },
];

// Chart ceiling in €k. Gridlines at thirds land on €60k and €30k.
const SCALE = 90;

const eur = (k: number) => `€${k.toFixed(1)}k`;

export default function RevenueChart({
  theme = 'light',
  data = DEFAULT_DATA,
  accent = '#EE7449',
  showIsland = true,
  replayKey,
}: RevenueChartProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [run, setRun] = useState(0); // bump to replay the bar animation
  const [active, setActive] = useState<number | null>(null); // open bar index, or null
  const [shown, setShown] = useState(0); // last opened bar (keeps sheet content while it slides away)

  // Start the bar animation once the phone is on screen
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (replayKey === undefined) return;
    setActive(null);
    setInView(true);
    setRun((r) => r + 1);
  }, [replayKey]);

  // Escape closes the sheet, without also closing whatever the phone sits in
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && active !== null) {
      e.stopPropagation();
      setActive(null);
    }
  };

  const { items, total, deals, n } = useMemo(() => {
    const total = data.reduce((s, x) => s + x.v, 0);
    const deals = data.reduce((s, x) => s + x.d, 0);
    let best = 0;
    data.forEach((x, i) => {
      if (x.v > data[best].v) best = i;
    });
    const items = data.map((x, i) => {
      const prev = i > 0 ? data[i - 1].v : null;
      const pct = prev ? ((x.v - prev) / prev) * 100 : null;
      const chg =
        pct === null ? null : `${pct >= 0 ? '+' : '−'}${Math.abs(pct).toFixed(1)}%`;
      return {
        ...x,
        isBest: i === best,
        money: eur(x.v),
        avg: `€${(x.v / x.d).toFixed(2)}k`,
        chgLine: chg ? `${chg} vs prev. month` : 'No previous month in range',
        chgColor: pct === null ? '#C9CFC3' : pct >= 0 ? '#B9E3A6' : '#F4A98C',
        h: Math.min(100, (x.v / SCALE) * 100),
      };
    });
    return { items, total, deals, n: data.length };
  }, [data]);

  const open = (i: number) => {
    setShown(i);
    setActive(i);
  };
  const close = () => setActive(null);
  const replay = () => {
    setActive(null);
    setInView(true);
    setRun((r) => r + 1);
  };

  const sheet = items[shown] ?? items[0];
  const isOpen = active !== null;

  return (
    <div ref={rootRef} className="rc-phone" data-theme={theme === 'dark' ? 'dark' : 'light'} onKeyDown={onKeyDown}>
      <style>{CSS}</style>

      {showIsland && <div className="rc-island" aria-hidden="true" />}

      <div className="rc-scroll">
        <header className="rc-header">
          <h1 className="rc-h1">Revenue</h1>
          <div className="rc-actions">
            <button type="button" className="rc-icon-btn" aria-label="Share">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="M7 8l5-5 5 5" />
                <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
              </svg>
            </button>
            <button type="button" className="rc-icon-btn" aria-label="Replay chart animation" onClick={replay}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
            </button>
          </div>
        </header>

        <section className="rc-chart-section">
          <div className="rc-card">
            <p className="rc-h2 rc-card-title">Monthly revenue</p>

            <div className="rc-plot">
              <div className="rc-rule" style={{ top: '33.333%' }} aria-hidden="true" />
              <div className="rc-rule" style={{ top: '66.666%' }} aria-hidden="true" />
              <span className="rc-axis" style={{ top: 'calc(33.333% - 17px)' }}>€60k</span>
              <span className="rc-axis" style={{ top: 'calc(66.666% - 17px)' }}>€30k</span>

              <div className="rc-bars">
                {items.map((item, i) => {
                  const dim = isOpen && active !== i;
                  return (
                    <div className="rc-col" key={i}>
                      <button
                        key={`${run}-${i}`}
                        type="button"
                        className={`rc-bar ${inView ? 'rc-grow' : 'rc-wait'}`}
                        aria-label={`${item.full} revenue ${item.money}`}
                        onClick={() => open(i)}
                        style={{
                          height: `${item.h}%`,
                          animationDelay: `${120 + i * 50}ms`,
                          background: item.isBest ? accent : 'var(--rc-bar)',
                          opacity: dim ? 'var(--rc-bar-dim)' : 1,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rc-labels">
              {items.map((item, i) => {
                const color =
                  active === i
                    ? 'var(--rc-ink)'
                    : isOpen
                    ? 'var(--rc-label-dim)'
                    : 'var(--rc-label)';
                return (
                  <div className="rc-label-col" key={i}>
                    <span className="rc-label" style={{ color }}>
                      {item.short}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rc-perf">
          <h2 className="rc-h2">Revenue Performance</h2>
          <div className="rc-total-wrap">
            <div className="rc-total">
              <span className="rc-total-sym">€</span>
              <span className="rc-total-num">{total.toFixed(2)}</span>
              <span className="rc-total-sym rc-total-k">k</span>
            </div>
            <p className="rc-total-label">Total revenue last 12 months</p>
          </div>

          <div className="rc-stats">
            <Stat label="Deals closed" value={String(deals)} icon={<IconCheck />} />
            <Stat label="Avg deal" value={`€${(total / deals).toFixed(1)}k`} icon={<IconTag />} />
            <Stat label="Monthly avg" value={`€${Math.round(total / n)}k`} icon={<IconBars />} />
          </div>
        </section>
      </div>

      {/* Bottom sheet */}
      <div
        className="rc-scrim"
        aria-hidden="true"
        onClick={close}
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
      />
      <div
        className="rc-sheet"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-label={`${sheet.full} ${sheet.yr} revenue detail`}
        style={{ transform: isOpen ? 'translateY(0)' : 'translateY(105%)' }}
      >
        <div className="rc-grabber" aria-hidden="true" />
        <div className="rc-sheet-head">
          <p className="rc-sheet-month">
            {sheet.full} {sheet.yr}
          </p>
          <button
            type="button"
            className="rc-icon-btn rc-icon-btn--sheet"
            aria-label="Close"
            onClick={close}
            tabIndex={isOpen ? 0 : -1}
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p className="rc-sheet-money">{sheet.money}</p>
        <p className="rc-sheet-chg" style={{ color: sheet.chgColor }}>
          {sheet.chgLine}
        </p>
        <div className="rc-sheet-stats">
          <div className="rc-sheet-stat">
            <p className="rc-sheet-stat-label">Deals closed</p>
            <p className="rc-sheet-stat-value">{sheet.d}</p>
          </div>
          <div className="rc-sheet-stat rc-sheet-stat--divided">
            <p className="rc-sheet-stat-label">Avg deal</p>
            <p className="rc-sheet-stat-value">{sheet.avg}</p>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rc-stat">
      {icon}
      <p className="rc-stat-label">{label}</p>
      <p className="rc-stat-value">{value}</p>
    </div>
  );
}

const svgProps = {
  'aria-hidden': true as const,
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};
const IconCheck = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.6 2.5L16 9.5" />
  </svg>
);
const IconTag = () => (
  <svg {...svgProps}>
    <path d="M3 12V4h8l10 10-8 8L3 12z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </svg>
);
const IconBars = () => (
  <svg {...svgProps}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

const CSS = `
/* ── Theme tokens ─────────────────────────────────────────── */
.rc-phone{
  --rc-bg:#CFDBCB; --rc-ink:#1E1F1C;
  --rc-bar:#262724; --rc-bar-dim:.35;
  --rc-label:rgba(30,31,28,.65); --rc-label-dim:rgba(30,31,28,.4);
  --rc-muted:#1E1F1C;
  --rc-grid:rgba(30,31,28,.09); --rc-rule:rgba(30,31,28,.4); --rc-axis:rgba(30,31,28,.7);
  --rc-border:rgba(30,31,28,.2); --rc-btn-border:rgba(30,31,28,.18);
  --rc-scrim:rgba(30,31,28,.35);
  --rc-sheet:#1E1F1C; --rc-sheet-edge:transparent; --rc-sheet-shadow:rgba(30,31,28,.18);
}
.rc-phone[data-theme="dark"]{
  --rc-bg:#141513; --rc-ink:#E6EBE2;
  --rc-bar:#B8C7B3; --rc-bar-dim:.3;
  --rc-label:rgba(230,235,226,.6); --rc-label-dim:rgba(230,235,226,.35);
  --rc-muted:rgba(230,235,226,.75);
  --rc-grid:rgba(230,235,226,.07); --rc-rule:rgba(230,235,226,.22); --rc-axis:rgba(230,235,226,.65);
  --rc-border:rgba(230,235,226,.14); --rc-btn-border:rgba(230,235,226,.2);
  --rc-scrim:rgba(0,0,0,.55);
  --rc-sheet:#262824; --rc-sheet-edge:rgba(237,239,232,.08); --rc-sheet-shadow:rgba(0,0,0,.5);
}

.rc-phone{position:relative;width:390px;height:844px;max-width:100%;overflow:hidden;border-radius:44px;background:var(--rc-bg);color:var(--rc-ink);font-family:'Space Grotesk',system-ui,sans-serif;font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}
.rc-phone *{box-sizing:border-box}
.rc-phone p,.rc-phone h1,.rc-phone h2{margin:0}
.rc-phone button{font:inherit}
.rc-phone button:focus-visible{outline:2px solid currentColor;outline-offset:2px}

.rc-island{position:absolute;top:11px;left:50%;transform:translateX(-50%);width:126px;height:37px;border-radius:20px;background:#000;z-index:10}
.rc-scroll{height:100%;overflow-y:auto;scrollbar-width:none}
.rc-scroll::-webkit-scrollbar{display:none}

.rc-header{padding:64px 20px 20px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.rc-h1{font-size:30.6px;font-weight:600;letter-spacing:-.02em;line-height:1}
.rc-h2{font-size:19.8px;font-weight:600;letter-spacing:-.02em;line-height:1}
.rc-actions{display:flex;gap:8px}
.rc-icon-btn{width:44px;height:44px;border-radius:22px;border:1px solid var(--rc-btn-border);background:transparent;color:var(--rc-ink);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.rc-icon-btn--sheet{border-color:rgba(237,239,232,.25);color:#EDEFE8}

.rc-chart-section{margin:0 12px;padding:12px 0 16px}
.rc-card{display:flex;flex-direction:column;border:1px solid var(--rc-border);border-radius:20px;padding:16px 12px}
.rc-card-title{margin:0 4px 20px!important}

.rc-plot{position:relative;height:300px;background-image:linear-gradient(to right,var(--rc-grid) 1px,transparent 1px),linear-gradient(to bottom,var(--rc-grid) 1px,transparent 1px);background-size:8.3333% 100%,100% 8.3333%}
.rc-rule{position:absolute;left:0;right:0;border-top:1px solid var(--rc-rule)}
.rc-axis{position:absolute;right:4px;z-index:3;pointer-events:none;font-size:11px;font-weight:500;color:var(--rc-axis)}
.rc-bars{position:absolute;inset:0 3px;display:flex;align-items:flex-end;gap:3px}
.rc-col{flex:1;height:100%;display:flex;align-items:flex-end}
.rc-bar{width:100%;border:0;border-radius:4px;padding:0;cursor:pointer;display:block;transform-origin:50% 100%;transition:opacity .2s ease}
.rc-wait{transform:scaleY(0)}
.rc-grow{animation:rc-grow 1100ms cubic-bezier(.2,.9,.25,1) both}
@keyframes rc-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}

.rc-labels{display:flex;gap:3px;padding:14px 3px 0}
.rc-label-col{flex:1;display:flex;justify-content:center}
.rc-label{writing-mode:vertical-rl;transform:rotate(180deg);font-size:13px;font-weight:500;letter-spacing:.01em;transition:color .2s ease}

.rc-perf{padding:24px 24px 48px;display:flex;flex-direction:column}
.rc-total-wrap{display:flex;flex-direction:column;gap:10px;margin-top:10px}
.rc-total{display:flex;align-items:flex-start;gap:6px}
.rc-total-sym{margin-top:4.5px;font-size:31.5px;font-weight:500;letter-spacing:-.03em;line-height:1}
.rc-total-sym:first-child{margin-right:2px}
.rc-total-num{font-size:74.7px;font-weight:500;letter-spacing:-.05em;line-height:.9}
.rc-total-label{font-size:13px;font-weight:600;line-height:1.2}

.rc-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:36px}
.rc-stat{display:flex;flex-direction:column;gap:6px}
.rc-stat-label{margin-top:8px!important;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--rc-muted)}
.rc-stat-value{font-size:30.6px;font-weight:500;letter-spacing:-.03em;line-height:1}

.rc-scrim{position:absolute;inset:0;z-index:20;background:var(--rc-scrim);transition:opacity 300ms ease}
.rc-sheet{position:absolute;left:0;right:0;bottom:0;z-index:30;background:var(--rc-sheet);color:#EDEFE8;border-radius:28px 28px 0 0;border-top:1px solid var(--rc-sheet-edge);padding:10px 24px 40px;display:flex;flex-direction:column;box-shadow:0 -12px 40px var(--rc-sheet-shadow);transition:transform 460ms cubic-bezier(.32,.72,0,1)}
.rc-grabber{width:36px;height:5px;border-radius:3px;background:rgba(237,239,232,.25);align-self:center}
.rc-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px}
.rc-sheet-month{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(237,239,232,.65)}
.rc-sheet-money{margin-top:4px!important;font-size:50px;font-weight:400;letter-spacing:-.04em;line-height:1}
.rc-sheet-chg{margin-top:12px!important;font-size:13px;font-weight:600}
.rc-sheet-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:28px}
.rc-sheet-stat{display:flex;flex-direction:column;gap:6px}
.rc-sheet-stat--divided{border-left:1px solid rgba(237,239,232,.18);padding-left:20px}
.rc-sheet-stat-label{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(237,239,232,.65)}
.rc-sheet-stat-value{font-size:26px;font-weight:400;letter-spacing:-.03em;line-height:1}

@media (prefers-reduced-motion: reduce){
  .rc-grow{animation:none}
  .rc-wait{transform:none}
  .rc-sheet,.rc-scrim,.rc-bar,.rc-label{transition:none}
}
`;
