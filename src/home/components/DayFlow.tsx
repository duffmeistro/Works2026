/**
 * DayFlow — swipeable "life tasks" prototype.
 *  • Swipe a card RIGHT → hand it to your agent (gooey lime pill + agent icon)
 *  • Swipe a card LEFT  → delete it (gooey coral pill + X), with Undo
 *  • Agent tab → live "thinking" cards that expand to show each step
 *
 * Self-contained: no dependencies beyond React. Renders a 390×844 phone screen.
 * Pass theme="light" | "dark". Font: Outfit (falls back to system-ui).
 */

import React from 'react';

type Theme = 'dark' | 'light';
type TaskType = 'meeting' | 'call' | 'todo';

export interface DayFlowProps {
  theme?: Theme;
  /** Confirmation / agent colour */
  accent?: string;
  /** Delete swipe colour */
  deleteColor?: string;
  /** Play the little left/right nudge on mount that teaches the gesture */
  hint?: boolean;
  /** Loop a send-to-agent swipe and a delete swipe on their own, undoing each */
  demo?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface Task {
  id: string; type: TaskType; time: string; title: string; meta: string; chips: string[]; steps: string[];
}
interface Item extends Task {
  agent: boolean; agentDone: boolean; step: number; startedAt: number; run: number;
  leaving: boolean; entering: boolean; gone: boolean;
}
interface Toast { kind: 'agent' | 'delete'; id: string; title: string; snapshot?: Item; index?: number }
interface State { items: Item[]; toast: Toast | null; toastOn: boolean; bump: boolean; tab: 'today' | 'agent'; open: Record<string, boolean> }
interface Anim {
  id: string; x: number; vx: number; tx: number;
  bx: number; vbx: number; bw: number; vbw: number; bh: number; vbh: number; ic: number; vic: number;
  side: 'agent' | 'delete' | null; committed: boolean;
  phase: 'drag' | 'return' | 'absorb' | 'fly' | 'nudge' | 'auto'; dragging: boolean;
}

const W = 358, H = 112, GAP = 10, T = 96, OFF = W + 90;

const TASKS: Task[] = [
  { id: 't1', type: 'meeting', time: '10:30', title: 'Northwind renewal', meta: 'with Dana Price · Room 4B', chips: ['45m', 'Zoom'],
    steps: ['Reading the last 6 emails with Dana', 'Pulling usage and contract dates', 'Drafting a one-page renewal brief', 'Flagging pricing risks'] },
  { id: 't2', type: 'call', time: '11:45', title: 'Follow up with Rahul', meta: 'Pricing questions from Friday', chips: ['15m'],
    steps: ['Finding Friday’s pricing thread', 'Listing his open questions', 'Drafting talking points', 'Preparing a follow-up email'] },
  { id: 't3', type: 'todo', time: 'Due 2pm', title: 'Send Q4 proposal deck', meta: 'Acme Logistics', chips: ['High'],
    steps: ['Locating the latest deck draft', 'Updating Q4 numbers', 'Writing the cover email to Acme', 'Checking attachments before send'] },
  { id: 't4', type: 'meeting', time: '15:00', title: 'Design crit', meta: 'Mobile onboarding v3', chips: ['30m', '4 ppl'],
    steps: ['Collecting onboarding v3 screens', 'Summarising last crit’s notes', 'Drafting the agenda', 'Sharing a pre-read with attendees'] },
  { id: 't5', type: 'call', time: '16:30', title: 'Intro · Lumen Labs', meta: 'Inbound lead, 40 seats', chips: ['20m'],
    steps: ['Researching Lumen Labs', 'Matching them to the 40-seat plan', 'Drafting intro talking points', 'Proposing a follow-up slot'] },
  { id: 't6', type: 'todo', time: 'Today', title: 'Log expenses', meta: '3 receipts waiting', chips: ['5m'],
    steps: ['Scanning 3 receipts', 'Matching them to card transactions', 'Filling in the expense report', 'Final check before submit'] },
  { id: 't7', type: 'todo', time: 'This week', title: 'Book Lisbon flights', meta: 'Offsite · 18–21 Nov', chips: ['Travel'],
    steps: ['Checking the offsite dates', 'Comparing flight options', 'Holding the two best fares', 'Waiting on your pick'] },
];
const SEED: Record<string, { step: number; ago: number }> = { t5: { step: 1, ago: 70000 }, t6: { step: 4, ago: 240000 } };
const LABEL: Record<TaskType, string> = { meeting: 'Meeting', call: 'Call', todo: 'To-do' };
const DONE: Record<TaskType, string> = { meeting: 'Brief ready to review', call: 'Talking points ready', todo: 'Done · ready to review' };
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// Demo loop: [ms to wait, action]
const DEMO: [number, (df: DayFlow) => void][] = [
  [900, (df) => df.demoSwipe('t1', 'agent')],
  [2600, (df) => df.demoUndo()],
  [1300, (df) => df.demoSwipe('t2', 'delete')],
  [2000, (df) => df.demoUndo()],
  [700, () => {}],
];

const palette = (theme: Theme, accent: string) => theme === 'light' ? {
  bg: '#EEEEEA', fg: '#141414', muted: '#66666C', card: '#FFFFFF',
  cardShadow: '0 1px 2px rgba(20,20,20,0.05), 0 8px 22px rgba(20,20,20,0.06)',
  chipBg: '#F0F0EC', chipFg: '#3A3A3F', legendBg: '#E2E2DD', legendFg: '#3A3A3F',
  strip: '#F2F2EE', chevBg: '#FFFFFF', chevShadow: '0 1px 3px rgba(20,20,20,0.08)',
  doneMarkBg: accent, doneMarkFg: '#141414', spinTrack: '#E3E3DE', spinArc: '#6E8F00', queuedRing: '#B4B4B9',
  lineDone: '#C4C4C9', linePending: '#E6E6E1', stepDone: '#66666C', stepActive: '#141414', stepQueued: '#74747A',
  footBorder: '#ECECE7', toastBg: '#141414', toastFg: '#F4F4F1', toastShadow: '0 12px 32px rgba(20,20,20,0.22)',
  navBg: '#141414', navFg: '#F4F4F1', navActiveBg: '#F4F4F1', navActiveFg: '#141414', navShadow: '0 10px 28px rgba(20,20,20,0.18)',
  accentInk: '#4E6A00', thinkBase: '#7A7A80', thinkHi: '#141414', emptyIconBg: '#FFFFFF', emptyIconFg: '#4E6A00', dot: '#7FA300',
} : {
  bg: '#0B0B0C', fg: '#F4F4F1', muted: '#A3A3A8', card: '#232325', cardShadow: 'none',
  chipBg: '#34343A', chipFg: '#D2D2D6', legendBg: '#1C1C1F', legendFg: '#A3A3A8',
  strip: '#18181A', chevBg: '#2A2A2E', chevShadow: 'none',
  doneMarkBg: '#3A3A3F', doneMarkFg: accent, spinTrack: '#3A3A3F', spinArc: accent, queuedRing: '#55555B',
  lineDone: '#4A4A50', linePending: '#2E2E33', stepDone: '#B4B4BA', stepActive: '#F4F4F1', stepQueued: '#9A9AA0',
  footBorder: '#313136', toastBg: '#26262A', toastFg: '#F4F4F1', toastShadow: '0 12px 32px rgba(0,0,0,0.45)',
  navBg: '#F2F2EE', navFg: '#141414', navActiveBg: '#141414', navActiveFg: '#F4F4F1', navShadow: 'none',
  accentInk: accent, thinkBase: '#8E8E94', thinkHi: '#F4F4F1', emptyIconBg: '#232325', emptyIconFg: accent, dot: accent,
};

const CSS = `
.df-root *{box-sizing:border-box}
.df-list::-webkit-scrollbar{display:none}.df-list{scrollbar-width:none}
.df-dots i{display:inline-block;width:4px;height:4px;border-radius:2px;background:currentColor;margin-left:3px;animation:df-blink 1.2s infinite ease-in-out}
.df-dots i:nth-child(2){animation-delay:.15s}.df-dots i:nth-child(3){animation-delay:.3s}
@keyframes df-blink{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-2px)}}
.df-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;padding:0}
.df-sr:focus-visible{width:auto;height:30px;clip:auto;padding:0 12px;border-radius:15px;background:var(--df-fg);color:var(--df-bg);font:500 12px inherit;bottom:12px;outline:2px solid var(--df-accent)}
.df-sr.a1:focus-visible{right:120px}.df-sr.a2:focus-visible{right:14px}
.df-spin{animation:df-spin .9s linear infinite;transform-origin:50% 50%}
@keyframes df-spin{to{transform:rotate(360deg)}}
.df-pulse{position:absolute;inset:-5px;border-radius:50%;animation:df-pulse 1.8s ease-out infinite;pointer-events:none}
@keyframes df-pulse{0%{transform:scale(.85);opacity:.8}100%{transform:scale(1.35);opacity:0}}
.df-think{background:linear-gradient(90deg,var(--df-tb) 0%,var(--df-tb) 35%,var(--df-th) 50%,var(--df-tb) 65%,var(--df-tb) 100%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:df-shim 1.8s linear infinite}
@keyframes df-shim{0%{background-position:110% 0}100%{background-position:-110% 0}}
@media (prefers-reduced-motion: reduce){.df-dots i,.df-spin,.df-pulse,.df-think{animation:none}.df-think{color:var(--df-th);background:none}}
`;

/* ---------- icons ---------- */
const s = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const IconBot = ({ size = 22, w = 1.9 }: { size?: number; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...s} strokeWidth={w} aria-hidden="true"><rect x="4" y="8" width="16" height="12" rx="4" /><path d="M12 8V4.5" /><circle cx="12" cy="3.6" r="1" /><path d="M9.5 13.2v1.4M14.5 13.2v1.4" /></svg>
);
const IconCheck = ({ size = 15, w = 2.4 }: { size?: number; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...s} strokeWidth={w} aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
const IconX = () => (<svg width="26" height="26" viewBox="0 0 24 24" {...s} strokeWidth={2.2} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>);
const IconCal = ({ size = 15, w = 1.8 }: { size?: number; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...s} strokeWidth={w} aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
const IconPhone = () => (<svg width="15" height="15" viewBox="0 0 24 24" {...s} strokeWidth={1.8} aria-hidden="true"><path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" /></svg>);
const IconTodo = () => (<svg width="15" height="15" viewBox="0 0 24 24" {...s} strokeWidth={1.8} aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12.2l2.4 2.4 4.6-4.8" /></svg>);
const TypeIcon = ({ t }: { t: TaskType }) => t === 'meeting' ? <IconCal /> : t === 'call' ? <IconPhone /> : <IconTodo />;

export default class DayFlow extends React.Component<DayFlowProps, State> {
  static defaultProps: Partial<DayFlowProps> = { theme: 'dark', accent: '#D4F36B', deleteColor: '#FF7759', hint: true };

  state: State = {
    items: TASKS.map((t) => {
      const sd = SEED[t.id];
      return { ...t, agent: !!sd, step: sd ? sd.step : 0, agentDone: !!sd && sd.step >= t.steps.length,
        startedAt: sd ? Date.now() - sd.ago : 0, run: sd ? 1 : 0, leaving: false, entering: false, gone: false };
    }),
    toast: null, toastOn: false, bump: false, tab: 'today', open: { t5: true },
  };

  private a: Anim | null = null;
  private drag: { id: string; sx: number; sy: number; ox: number; lock: 'x' | null; lx: number; lt: number } | null = null;
  private raf = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private tt: ReturnType<typeof setTimeout> | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;

  private later(fn: () => void, ms: number) { const t = setTimeout(fn, ms); this.timers.push(t); return t; }

  componentDidMount() {
    if (this.props.hint) {
      this.later(() => this.nudge('agent'), 900);
      this.later(() => this.nudge('delete'), 1900);
    }
    this.advance('t5', 1);
    this.interval = setInterval(() => this.forceUpdate(), 30000);
    if (this.props.demo) this.runDemo(0);
  }
  componentDidUpdate(prev: DayFlowProps) {
    if (prev.demo === this.props.demo) return;
    if (this.props.demo) this.runDemo(0);
    else if (this.demoTimer) { clearTimeout(this.demoTimer); this.demoTimer = null; }
  }
  componentWillUnmount() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.timers.forEach(clearTimeout);
    if (this.interval) clearInterval(this.interval);
    if (this.demoTimer) clearTimeout(this.demoTimer);
  }

  private demoTimer: ReturnType<typeof setTimeout> | null = null;
  private runDemo(step: number) {
    const [wait, act] = DEMO[step];
    this.demoTimer = setTimeout(() => {
      act(this);
      this.runDemo((step + 1) % DEMO.length);
    }, wait);
  }

  private find(id: string) { return this.state.items.find((i) => i.id === id); }
  private newAnim(id: string): Anim {
    return { id, x: 0, vx: 0, tx: 0, bx: 0, vbx: 0, bw: 0, vbw: 0, bh: 0, vbh: 0, ic: 0, vic: 0, side: null, committed: false, phase: 'drag', dragging: false };
  }
  private kick() { if (!this.raf) this.raf = requestAnimationFrame(this.tick); }

  private advance(id: string, run: number) {
    this.later(() => {
      const before = this.find(id);
      if (!before || !before.agent || before.run !== run || before.agentDone) return;
      const step = before.step + 1;
      this.setState((st) => ({ items: st.items.map((i) => (i.id === id && i.agent && i.run === run ? { ...i, step, agentDone: step >= i.steps.length } : i)) }));
      if (step < before.steps.length) this.advance(id, run);
    }, 2600 + Math.random() * 1800);
  }

  private band(raw: number, isAgentCard: boolean) {
    const sg = raw < 0 ? -1 : 1, m = Math.abs(raw);
    if (sg > 0 && isAgentCard) return sg * Math.min(m * 0.18, 26);
    const L = 130;
    return sg * (m < L ? m : L + (m - L) * 0.32);
  }
  private resetBlob(a: Anim) {
    a.bx = a.side === 'delete' ? W + a.x : a.x;
    a.vbx = 0; a.bw = 0; a.vbw = 0; a.bh = 0; a.vbh = 0; a.ic = 0; a.vic = 0;
  }

  private tick = () => {
    this.raf = 0;
    const a = this.a;
    if (!a) return;
    if (!a.dragging) {
      const fly = a.phase === 'fly';
      const soft = a.phase === 'nudge' || a.phase === 'auto';
      const k = fly ? 0.07 : soft ? 0.1 : 0.13;
      const dm = fly ? 0.88 : soft ? 0.78 : 0.75;
      a.vx += (a.tx - a.x) * k; a.vx *= dm; a.x += a.vx;
      if (soft) a.committed = Math.abs(a.x) > T;
    } else a.vx *= 0.85;

    const left = a.side === 'delete';
    const edge = left ? W + a.x : a.x;
    const d = Math.abs(a.x);
    const popped = a.phase === 'fly' && a.x < -W * 0.45;
    const PW = 60, PGAP = 10;
    let cx = a.bx, bw = 0, bh = 0;
    if (!a.side) { /* nothing */ }
    else if (a.phase === 'absorb') { cx = edge + (left ? -10 : 10); }
    else if (popped) { cx = a.bx; }
    else if (a.committed) {
      cx = left ? Math.min(W - PW / 2, edge + PGAP + PW / 2) : Math.max(PW / 2, edge - PGAP - PW / 2);
      bw = PW; bh = H;
    } else {
      const p = clamp(d / T, 0, 1);
      const sz = Math.min(d * 0.6, 56);
      cx = left ? edge + sz * 0.5 - 6 : edge - sz * 0.5 + 6;
      bw = sz * 1.05;
      bh = sz * 0.9 + (H * 0.72 - sz * 0.9) * p * p;
    }
    a.vbx += (cx - a.bx) * 0.12; a.vbx *= 0.74; a.bx += a.vbx;
    a.vbw += (bw - a.bw) * 0.11; a.vbw *= 0.76; a.bw += a.vbw;
    a.vbh += (bh - a.bh) * 0.1; a.vbh *= 0.76; a.bh += a.vbh;
    const icT = a.committed && a.phase !== 'absorb' && !popped ? 1 : 0;
    a.vic += (icT - a.ic) * 0.14; a.vic *= 0.72; a.ic += a.vic;

    if (a.phase === 'fly') {
      if (a.x < -(W + 30) && a.bw < 1 && a.ic < 0.03) { this.finishDelete(a.id); return; }
    } else if (!a.dragging && (a.phase === 'return' || a.phase === 'absorb') &&
      Math.abs(a.x - a.tx) < 0.3 && Math.abs(a.vx) < 0.3 && a.bw < 0.8 && a.bh < 0.8 && Math.abs(a.ic) < 0.02 && Math.abs(a.vic) < 0.02) {
      this.a = null; this.forceUpdate(); return;
    }
    this.forceUpdate();
    this.kick();
  };

  private down(id: string, e: React.PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const it = this.find(id);
    if (!it || it.leaving || it.gone) return;
    if (this.a && this.a.id !== id) {
      if (this.a.phase === 'fly') this.finishDelete(this.a.id); else this.a = null;
    }
    if (!this.a) this.a = this.newAnim(id);
    const a = this.a;
    a.dragging = false;
    this.drag = { id, sx: e.clientX, sy: e.clientY, ox: a.x, lock: null, lx: e.clientX, lt: performance.now() };
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch { /* noop */ }
  }

  private move(e: React.PointerEvent) {
    const d = this.drag, a = this.a;
    if (!d || !a || a.id !== d.id) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (!d.lock) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { d.lock = 'x'; a.dragging = true; a.phase = 'drag'; }
      else if (Math.abs(dy) > 8) { this.drag = null; a.phase = 'return'; a.tx = 0; this.kick(); return; }
      else return;
    }
    const it = this.find(d.id);
    const x = this.band(d.ox + dx, !!(it && it.agent));
    const now = performance.now(), dt = Math.max(1, now - d.lt);
    const v = ((e.clientX - d.lx) / dt) * 16;
    a.vx = a.vx * 0.6 + v * 0.4; d.lx = e.clientX; d.lt = now;
    a.x = x;
    let side: Anim['side'] = x < -0.5 ? 'delete' : x > 0.5 ? 'agent' : a.side;
    if (it && it.agent && side === 'agent') side = null;
    if (side !== a.side) { a.side = side; a.committed = false; this.resetBlob(a); }
    const c = !!side && Math.abs(x) > T;
    if (c !== a.committed) {
      a.committed = c;
      if (c) { try { navigator.vibrate?.(10); } catch { /* noop */ } }
    }
    this.kick();
  }

  private up() {
    const d = this.drag; this.drag = null;
    const a = this.a;
    if (!d || !a) return;
    if (!d.lock) { a.phase = 'return'; a.tx = 0; this.kick(); return; }
    this.release();
  }

  private release() {
    const a = this.a; if (!a) return;
    a.dragging = false;
    if (a.committed && a.side === 'agent') {
      a.phase = 'absorb'; a.tx = 0; a.committed = false;
      this.assign(a.id);
    } else if (a.committed && a.side === 'delete') {
      a.phase = 'fly'; a.tx = -OFF; a.vx = Math.min(a.vx, -9);
    } else {
      a.phase = 'return'; a.tx = 0; a.committed = false;
    }
    this.kick();
  }

  private nudge(side: 'agent' | 'delete') {
    if (this.a || this.drag) return;
    const it = this.state.items.find((i) => !i.gone && !i.agent);
    if (!it) return;
    const a = this.newAnim(it.id);
    a.side = side; a.phase = 'nudge'; a.tx = side === 'agent' ? 64 : -64;
    this.resetBlob(a);
    this.a = a; this.kick();
    this.later(() => { if (this.a === a && a.phase === 'nudge') { a.phase = 'return'; a.tx = 0; this.kick(); } }, 460);
  }

  private auto(id: string, side: 'agent' | 'delete') {
    if (this.a) return;
    const it = this.find(id);
    if (!it || it.gone || (side === 'agent' && it.agent)) return;
    const a = this.newAnim(id);
    a.side = side; a.phase = 'auto'; a.tx = side === 'agent' ? T + 36 : -(T + 36);
    this.resetBlob(a);
    this.a = a; this.kick();
    this.later(() => { if (this.a === a) { a.committed = true; this.release(); } }, 420);
  }

  private assign(id: string) {
    const it = this.find(id);
    const run = Date.now();
    this.setState((st) => ({ items: st.items.map((i) => (i.id === id ? { ...i, agent: true, agentDone: false, step: 0, startedAt: run, run } : i)), bump: true }));
    this.later(() => this.setState({ bump: false }), 240);
    this.showToast({ kind: 'agent', id, title: it ? it.title : '' });
    this.advance(id, run);
  }

  private finishDelete(id: string) {
    const idx = this.state.items.findIndex((i) => i.id === id);
    const snap = this.state.items[idx];
    if (this.a && this.a.id === id) this.a = null;
    if (!snap) return;
    this.setState((st) => ({ items: st.items.map((i) => (i.id === id ? { ...i, leaving: true, gone: true } : i)) }));
    this.showToast({ kind: 'delete', id, title: snap.title, snapshot: { ...snap }, index: idx });
    this.later(() => this.setState((st) => ({ items: st.items.filter((i) => !(i.id === id && i.leaving)) })), 420);
  }

  private showToast(t: Toast) {
    this.setState({ toast: t, toastOn: true });
    if (this.tt) clearTimeout(this.tt);
    this.tt = this.later(() => this.setState({ toastOn: false }), 4200);
  }

  private undo = () => {
    const t = this.state.toast;
    if (!t || !this.state.toastOn) return;
    if (this.tt) clearTimeout(this.tt);
    if (t.kind === 'agent') {
      this.setState((st) => ({ toastOn: false, items: st.items.map((i) => (i.id === t.id ? { ...i, agent: false, agentDone: false } : i)) }));
      return;
    }
    if (this.find(t.id)) {
      this.setState((st) => ({ toastOn: false, items: st.items.map((i) => (i.id === t.id ? { ...i, leaving: false, gone: false } : i)) }));
    } else if (t.snapshot) {
      const back: Item = { ...t.snapshot, leaving: false, gone: false, entering: true };
      this.setState((st) => {
        const items = st.items.slice();
        items.splice(Math.min(t.index ?? 0, items.length), 0, back);
        return { items, toastOn: false };
      });
      this.later(() => this.setState((st) => ({ items: st.items.map((i) => (i.id === t.id ? { ...i, entering: false } : i)) })), 40);
    }
    const a = this.newAnim(t.id);
    a.x = -OFF; a.tx = 0; a.phase = 'return'; a.side = null;
    this.a = a; this.kick();
  };

  demoSwipe(id: string, side: 'agent' | 'delete') { this.auto(id, side); }
  demoUndo() { this.undo(); }

  private toggle(id: string) { this.setState((st) => ({ open: { ...st.open, [id]: !st.open[id] } })); }

  render() {
    const theme = this.props.theme ?? 'dark';
    const accent = this.props.accent ?? '#D4F36B';
    const danger = this.props.deleteColor ?? '#FF7759';
    const P = palette(theme, accent);
    const { items, tab, toast, toastOn, bump, open } = this.state;
    const live = items.filter((i) => !i.gone);
    const agentCount = live.filter((i) => i.agent).length;
    const onToday = tab === 'today', onAgent = tab === 'agent';
    const ease = 'cubic-bezier(.22,1,.36,1)';
    const fid = 'df-goo-' + theme;
    const a = this.a;

    const pageStyle = (on: boolean, dir: number): React.CSSProperties => ({
      position: 'absolute', inset: 0, opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : dir * 40}px)`,
      pointerEvents: on ? 'auto' : 'none', transition: `opacity .35s ease, transform .55s ${ease}`,
    });
    const navBtn = (on: boolean): React.CSSProperties => ({
      flex: `${on ? 2.2 : 1} 1 0px`, minWidth: 0, height: 56, padding: '0 18px', border: 0, borderRadius: 28,
      background: on ? P.navActiveBg : 'transparent', color: on ? P.navActiveFg : P.navFg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, font: 'inherit', fontSize: 15, fontWeight: 500,
      cursor: 'pointer', transition: `background-color .35s ease, color .35s ease, flex-grow .5s ${ease}`,
    });
    const chip = (bg: string, fg: string): React.CSSProperties => ({ height: 22, padding: '0 8px', borderRadius: 8, display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 500, background: bg, color: fg });
    const ellipsis: React.CSSProperties = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
    const h1: React.CSSProperties = { position: 'absolute', top: 76, left: 20, margin: 0, fontSize: 38, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1 };
    const sub: React.CSSProperties = { position: 'absolute', top: 126, left: 20, right: 20, display: 'flex', alignItems: 'center', fontSize: 13, color: P.muted };
    const list: React.CSSProperties = { position: 'absolute', top: 160, left: 16, width: W, bottom: 96, overflowY: 'auto', overflowX: 'hidden', paddingTop: 6 };

    const rootVars = { '--df-bg': P.bg, '--df-fg': P.fg, '--df-accent': accent, '--df-tb': P.thinkBase, '--df-th': P.thinkHi } as React.CSSProperties;

    return (
      <div className={'df-root ' + (this.props.className ?? '')} style={{
        width: 390, height: 844, position: 'relative', overflow: 'hidden', borderRadius: 48, background: P.bg, color: P.fg,
        fontFamily: 'Outfit, system-ui, -apple-system, sans-serif', WebkitFontSmoothing: 'antialiased', userSelect: 'none', ...rootVars, ...this.props.style,
      }}>
        <style>{CSS}</style>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <filter id={fid} x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        {/* Dynamic island */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 11, left: 132, width: 126, height: 37, borderRadius: 20, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12, zIndex: 5 }}>
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#16161C', boxShadow: 'inset 0 0 0 2px #0D0D12' }} />
        </div>

        {/* ---------------- TODAY ---------------- */}
        <div style={pageStyle(onToday, -1)} aria-hidden={!onToday}>
          <h1 style={h1}>Today</h1>
          <div style={{ ...sub, justifyContent: 'space-between' }}>
            <span>{live.length} open · {agentCount} with agent</span>
            <div style={{ display: 'flex', gap: 6 }} aria-hidden="true">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, height: 24, padding: '0 10px', borderRadius: 12, background: P.legendBg, color: P.legendFg }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: danger }} />← Delete
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, height: 24, padding: '0 10px', borderRadius: 12, background: P.legendBg, color: P.legendFg }}>
                Agent →<span style={{ width: 6, height: 6, borderRadius: 3, background: P.dot }} />
              </span>
            </div>
          </div>

          <div className="df-list" style={{ ...list, paddingBottom: 80 }}>
            {items.map((it) => {
              const act = a && a.id === it.id ? a : null;
              const x = act ? act.x : it.gone ? -OFF : 0;
              const d = Math.abs(x);
              const rot = act ? clamp(act.vx * 0.1, -4, 4) : 0;
              const sc = 1 - Math.min(d, 160) * 0.00035;
              const bw = act ? Math.max(0, act.bw) : 0;
              const bh = act ? Math.max(0, act.bh) : 0;
              const ic = act ? clamp(act.ic, 0, 1.3) : 0;
              const agentSide = !!act && act.side === 'agent';
              const collapsed = it.leaving || it.entering;
              const tf = `translate3d(${x.toFixed(2)}px,0,0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
              const cardBg = it.agent ? accent : P.card;
              const fg = it.agent ? '#141414' : P.fg;
              const muted = it.agent ? 'rgba(20,20,20,0.68)' : P.muted;
              const cBg = it.agent ? 'rgba(20,20,20,0.10)' : P.chipBg;
              const cFg = it.agent ? '#141414' : P.chipFg;
              const status = it.agentDone ? DONE[it.type] : it.steps[it.step];
              return (
                <div key={it.id} style={{ position: 'relative', height: collapsed ? 0 : H, marginBottom: collapsed ? 0 : GAP, opacity: collapsed ? 0 : 1,
                  transition: 'height .4s cubic-bezier(.6,0,.2,1), margin .4s cubic-bezier(.6,0,.2,1), opacity .3s ease' }}>
                  {P.cardShadow !== 'none' && (
                    <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, borderRadius: 26, background: cardBg, boxShadow: P.cardShadow, transform: tf, transition: 'background-color .55s ease' }} />
                  )}
                  <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, filter: act && act.side ? `url(#${fid})` : 'none' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: cardBg, transform: tf, transition: 'background-color .55s ease', willChange: 'transform' }} />
                    {act && act.side && bw > 0.5 && bh > 0.5 && (
                      <div style={{ position: 'absolute', left: act.bx - bw / 2, top: (H - bh) / 2, width: bw, height: bh, borderRadius: Math.min(Math.min(bw, bh) / 2, 26), background: agentSide ? accent : danger }} />
                    )}
                  </div>
                  {act && act.side && ic > 0.02 && (
                    <div aria-hidden="true" style={{ position: 'absolute', left: act.bx - 22, top: 34, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#141414',
                      opacity: clamp(ic, 0, 1), transform: `scale(${ic.toFixed(3)}) rotate(${((1 - ic) * -18).toFixed(1)}deg)`, pointerEvents: 'none' }}>
                      {agentSide ? <IconBot size={28} w={2} /> : <IconX />}
                    </div>
                  )}
                  <article
                    onPointerDown={(e) => this.down(it.id, e)} onPointerMove={(e) => this.move(e)} onPointerUp={() => this.up()} onPointerCancel={() => this.up()}
                    style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, padding: '16px 18px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      color: fg, transform: tf, touchAction: 'pan-y', cursor: 'grab', willChange: 'transform' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: muted }}>
                        <TypeIcon t={it.type} /><span>{LABEL[it.type]} · {it.time}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>{it.chips.map((c) => <span key={c} style={chip(cBg, cFg)}>{c}</span>)}</div>
                    </div>
                    <div style={{ fontSize: 25, letterSpacing: '-0.02em', lineHeight: 1.1, ...ellipsis }}>{it.title}</div>
                    {it.agent ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, minWidth: 0 }}>
                        <span style={{ display: 'flex', flex: 'none' }}><IconBot size={15} w={2} /></span>
                        <span style={ellipsis}>{status}</span>
                        {it.agentDone ? <IconCheck /> : <span className="df-dots" aria-hidden="true"><i /><i /><i /></span>}
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: muted, ...ellipsis }}>{it.meta}</div>
                    )}
                    <button className="df-sr a1" onClick={() => this.auto(it.id, 'agent')}>Send to agent</button>
                    <button className="df-sr a2" onClick={() => this.auto(it.id, 'delete')}>Delete</button>
                  </article>
                </div>
              );
            })}
            {live.length === 0 && (
              <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: P.muted, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: accent, color: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconCheck size={28} w={2.2} /></div>
                <span style={{ fontSize: 22, color: P.fg }}>All clear</span>
                <span style={{ fontSize: 14 }}>Nothing left on today’s list.</span>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- AGENT ---------------- */}
        <div style={pageStyle(onAgent, 1)} aria-hidden={!onAgent}>
          <h1 style={h1}>Agent</h1>
          <div style={{ ...sub, gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: P.dot }} />
            <span>{live.filter((i) => i.agent && !i.agentDone).length} working · {live.filter((i) => i.agent && i.agentDone).length} ready for review</span>
          </div>
          <div className="df-list" style={{ ...list, paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {live.filter((i) => i.agent).map((i) => {
              const N = i.steps.length, st = Math.min(i.step, N), done = st >= N, isOpen = !!open[i.id];
              const mins = Math.floor((Date.now() - i.startedAt) / 60000);
              return (
                <article key={i.id} style={{ flex: 'none', background: P.card, borderRadius: 26, padding: '16px 14px 14px 18px', display: 'flex', flexDirection: 'column', boxShadow: P.cardShadow }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingRight: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: P.muted }}><TypeIcon t={i.type} /><span>{LABEL[i.type]} · {i.time}</span></div>
                    <div style={{ display: 'flex', gap: 4 }}>{i.chips.map((c) => <span key={c} style={chip(P.chipBg, P.chipFg)}>{c}</span>)}</div>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 25, letterSpacing: '-0.02em', lineHeight: 1.1, ...ellipsis }}>{i.title}</div>

                  <button onClick={() => this.toggle(i.id)} aria-expanded={isOpen} style={{ marginTop: 14, width: '100%', height: 58, border: 0, borderRadius: 20, background: P.strip,
                    display: 'flex', alignItems: 'center', gap: 12, padding: '0 9px 0 11px', color: P.fg, font: 'inherit', textAlign: 'left', cursor: 'pointer' }}>
                    <span style={{ position: 'relative', width: 36, height: 36, borderRadius: 18, background: accent, color: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                      {done ? <IconCheck size={20} /> : (<><span className="df-pulse" style={{ border: `2px solid ${theme === 'light' ? '#9DC21A' : accent}` }} /><IconBot size={20} w={2} /></>)}
                    </span>
                    <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {done
                        ? <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: P.accentInk }}>Ready for review</span>
                        : <span className="df-think" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Thinking</span>}
                      <span style={{ fontSize: 14, ...ellipsis }}>{done ? DONE[i.type] : i.steps[st]}</span>
                    </span>
                    <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 20, background: P.chevBg, boxShadow: P.chevShadow, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
                      transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: `transform .5s ${ease}` }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" {...s} strokeWidth={2}><path d="M6 9.5l6 6 6-6" /></svg>
                    </span>
                  </button>

                  <div style={{ height: isOpen ? N * 38 + 50 : 0, overflow: 'hidden', opacity: isOpen ? 1 : 0, transition: `height .5s ${ease}, opacity .35s ease` }}>
                    <div style={{ padding: '16px 8px 0 12px', display: 'flex', flexDirection: 'column' }}>
                      {i.steps.map((label, k) => (
                        <div key={k} style={{ position: 'relative', height: 38, display: 'flex', gap: 14 }}>
                          {k < N - 1 && <span style={{ position: 'absolute', left: 8, top: 21, width: 2, height: 20, borderRadius: 1, background: k < st ? P.lineDone : P.linePending }} />}
                          <span style={{ width: 18, height: 18, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {k < st && <span style={{ width: 18, height: 18, borderRadius: 9, background: P.doneMarkBg, color: P.doneMarkFg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconCheck size={11} w={3.4} /></span>}
                            {k === st && !done && (
                              <svg className="df-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" stroke={P.spinTrack} strokeWidth="3" /><path d="M12 3a9 9 0 0 1 9 9" stroke={P.spinArc} strokeWidth="3" strokeLinecap="round" />
                              </svg>
                            )}
                            {k > st && <span style={{ width: 8, height: 8, borderRadius: 4, boxShadow: `inset 0 0 0 2px ${P.queuedRing}` }} />}
                          </span>
                          <span style={{ fontSize: 14, lineHeight: '18px', color: k < st ? P.stepDone : k === st ? P.stepActive : P.stepQueued, fontWeight: k === st ? 500 : 400 }}>{label}</span>
                        </div>
                      ))}
                      <div style={{ marginTop: 2, padding: '12px 0 2px', borderTop: `1px solid ${P.footBorder}`, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: P.muted }}>
                        <span>{done ? `All ${N} steps done` : `Step ${st + 1} of ${N}`}</span>
                        <span>{mins < 1 ? 'Started just now' : `Started ${mins}m ago`}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            {agentCount === 0 && (
              <div style={{ height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: P.muted, textAlign: 'center', padding: '0 24px' }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: P.emptyIconBg, color: P.emptyIconFg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconBot size={28} w={2} /></div>
                <span style={{ fontSize: 22, color: P.fg }}>Nothing in the queue</span>
                <span style={{ fontSize: 14 }}>Swipe a task right on Today to hand it to your agent.</span>
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        <div role="status" style={{ position: 'absolute', left: 16, right: 16, bottom: 104, height: 56, borderRadius: 22, background: P.toastBg, color: P.toastFg, boxShadow: P.toastShadow,
          display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 0 18px', transform: `translateY(${toastOn ? 0 : 150}px) scale(${toastOn ? 1 : 0.92})`, opacity: toastOn ? 1 : 0,
          pointerEvents: toastOn ? 'auto' : 'none', transition: 'transform .5s cubic-bezier(.34,1.45,.64,1), opacity .3s ease' }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: toast?.kind === 'agent' ? accent : danger, flex: 'none' }} />
          <span style={{ flex: 1, minWidth: 0, fontSize: 14, ...ellipsis }}>{toast ? (toast.kind === 'agent' ? `Agent picked up “${toast.title}”` : `Deleted “${toast.title}”`) : ''}</span>
          <button onClick={this.undo} style={{ height: 40, padding: '0 16px', border: 0, borderRadius: 20, background: '#F4F4F1', color: '#141414', font: 'inherit', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Undo</button>
        </div>

        {/* Bottom nav */}
        <nav aria-label="Main" style={{ position: 'absolute', left: 16, right: 16, bottom: 22, height: 68, borderRadius: 34, background: P.navBg, boxShadow: P.navShadow, display: 'flex', alignItems: 'center', padding: 6, gap: 4 }}>
          <button onClick={() => this.setState({ tab: 'today' })} aria-label="Today" aria-current={onToday ? 'page' : undefined} style={navBtn(onToday)}>
            {onToday && <span>Today</span>}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>
          </button>
          <button aria-label="Calendar" style={navBtn(false)}><IconCal size={22} w={1.9} /></button>
          <button onClick={() => this.setState({ tab: 'agent' })} aria-label={`Agent queue, ${agentCount} tasks`} aria-current={onAgent ? 'page' : undefined} style={{ ...navBtn(onAgent), gap: 12 }}>
            {onAgent && <span>Agent</span>}
            <span style={{ position: 'relative', display: 'flex' }}>
              <IconBot />
              <span aria-hidden="true" style={{ position: 'absolute', top: -9, left: 13, minWidth: 22, height: 22, padding: '0 6px', borderRadius: 11, background: accent, color: '#141414', fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 3px ${onAgent ? P.navActiveBg : P.navBg}`,
                transform: `scale(${bump ? 1.3 : 1})`, transition: 'transform .35s cubic-bezier(.34,1.8,.64,1), box-shadow .35s ease' }}>{agentCount}</span>
            </span>
          </button>
          <button aria-label="Messages" style={navBtn(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" {...s} strokeWidth={1.9} aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17H6.5A2.5 2.5 0 0 1 4 14.5z" /></svg>
          </button>
        </nav>
      </div>
    );
  }
}
