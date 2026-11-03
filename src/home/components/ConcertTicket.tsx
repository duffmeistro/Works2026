/**
 * Fleet Foxes concert ticket — concept.
 * The entry barcode stays locked until the ticket holder holds their
 * fingerprint on the pad, then it fades in with a looping accent sweep.
 *
 * Usage:
 *   <ConcertTicket />                  // light, fingerprint (press and hold)
 *   <ConcertTicket theme="dark" />     // dark
 *   <ConcertTicket unlock="face" />    // Face ID (single tap)
 *   <ConcertTicket autoplay />         // loops the unlock (for previews)
 *
 * Font: loads Manrope via next/font in your layout and exposes it as
 * --font-manrope, or falls back to a plain 'Manrope' family.
 */

import { useCallback, useEffect, useMemo, useRef, useState, CSSProperties } from 'react';
import s from './ConcertTicket.module.css';

type Phase = 'locked' | 'scanning' | 'verified' | 'unlocking' | 'revealed';

export interface ConcertTicketProps {
  theme?: 'light' | 'dark';
  unlock?: 'fingerprint' | 'face';
  accent?: string;
  autoplay?: boolean;
  className?: string;
}

const COPY: Record<'fingerprint' | 'face', Record<Exclude<Phase, 'revealed'>, [string, string]>> = {
  fingerprint: {
    locked: ['HOLD TO UNLOCK ENTRY', 'Entry code is locked to the ticket holder'],
    scanning: ['SCANNING…', 'Entry code is locked to the ticket holder'],
    verified: ['UNLOCKED', 'Entry code is locked to the ticket holder'],
    unlocking: ['UNLOCKED', 'Entry code is locked to the ticket holder'],
  },
  face: {
    locked: ['TAP TO SHOW YOUR TICKET', 'Your entry code unlocks for your face only'],
    scanning: ['LOOK AT YOUR PHONE', 'Checking it’s you…'],
    verified: ['IT’S YOU', 'Unlocking your entry code'],
    unlocking: ['IT’S YOU', 'Unlocking your entry code'],
  },
};

const FACE = [
  'M5 15V10a5 5 0 0 1 5-5h5', 'M33 5h5a5 5 0 0 1 5 5v5', 'M43 33v5a5 5 0 0 1-5 5h-5', 'M15 43h-5a5 5 0 0 1-5-5v-5',
  'M16.5 17.5v4', 'M31.5 17.5v4', 'M24 17.5v9h-2.2', 'M17.5 31.5a9.5 9.5 0 0 0 13 0',
];

const FINGERPRINT = [
  'M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4',
  'M14 13.12c0 2.38 0 6.38-1 8.88',
  'M17.29 21.02c.12-.6.43-2.3.5-3.02',
  'M2 12a10 10 0 0 1 18-6',
  'M2 16h.01',
  'M21.8 16c.2-2 .131-5.354 0-6',
  'M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2',
  'M8.65 22c.21-.66.45-1.32.57-2',
  'M9 6.8a6 6 0 0 1 9 5.2v2',
];

function makeBars(n = 62) {
  let seed = 7;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  return Array.from({ length: n }, (_, i) => {
    const w = [1, 1, 2, 2, 3, 4][Math.floor(rnd() * 6)];
    const g = [1, 2, 2, 3][Math.floor(rnd() * 4)];
    return { w, g: i === n - 1 ? 0 : g };
  });
}

export default function ConcertTicket({ theme = 'light', unlock = 'fingerprint', accent = '#FF5B24', autoplay = false, className }: ConcertTicketProps) {
  const [phase, setPhase] = useState<Phase>('locked');
  const [reveal, setReveal] = useState(0); // remounts the code block so its animations replay
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phaseRef = useRef<Phase>('locked');
  const bars = useMemo(() => makeBars(), []);

  const go = (p: Phase) => { phaseRef.current = p; setPhase(p); };
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const begin = useCallback(() => {
    if (phaseRef.current !== 'locked') return;
    clear();
    go('scanning');
    const verify = unlock === 'face' ? 450 : 0; // Face ID holds on a tick before unlocking
    timers.current.push(setTimeout(() => {
      if (verify) go('verified');
      timers.current.push(setTimeout(() => {
        go('unlocking');
        timers.current.push(setTimeout(() => { setReveal((r) => r + 1); go('revealed'); }, 200));
      }, verify));
    }, 1300));
  }, [unlock]);

  const cancel = useCallback(() => {
    if (unlock === 'fingerprint' && phaseRef.current === 'scanning') { clear(); go('locked'); }
  }, [unlock]);

  useEffect(() => { clear(); go('locked'); }, [unlock]);

  const reset = useCallback(() => { clear(); go('locked'); }, []);

  useEffect(() => () => clear(), []);

  useEffect(() => {
    if (!autoplay) return;
    let alive = true;
    const loop = () => {
      if (!alive) return;
      reset();
      const a = setTimeout(begin, 1200);
      const b = setTimeout(loop, 1200 + 1950 + 4200);
      timers.current.push(a, b);
    };
    loop();
    return () => { alive = false; clear(); };
  }, [autoplay, begin, reset]);

  const revealed = phase === 'revealed';
  const rootClass = [s.root, theme === 'dark' ? s.dark : '', className ?? ''].join(' ');

  return (
    <div className={rootClass} style={{ '--accent': accent } as CSSProperties}>
      <div className={s.screen}>
        <div key={`island-${reveal}`} className={`${s.island} ${revealed ? s.pop : ''}`} aria-live="polite">
          <div className={s.islandContent}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="m8 12.5 2.8 2.8L16.5 9" /></svg>
            <span>{revealed ? 'Holder verified' : ''}</span>
          </div>
        </div>

        <div className={s.status} aria-hidden="true">
          <time>9:41</time>
          <div className={s.icons}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="#111"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 4.2a9.5 9.5 0 0 1 13 0" /><path d="M4 7a6 6 0 0 1 8 0" /><circle cx="8" cy="10" r="1" fill="#111" /></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#111" opacity=".45" /><rect x="2" y="2" width="18" height="9" rx="2" fill="#111" /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="#111" opacity=".45" /></svg>
          </div>
        </div>

        <section className={s.top}>
          <div className={s.tag}><b>LIVE</b>IN CONCERT ’27</div>
          <h1 className={s.band}><span>Fleet</span><span>Foxes</span></h1>
          <div className={s.venue}>
            <div><strong>3ARENA</strong><small>North Wall Quay</small></div>
            <i aria-hidden="true" />
            <div><strong>DUBLIN</strong><small>Ireland</small></div>
          </div>
        </section>

        <section className={s.details}>
          <div className={s.holder}><small>Ticket holder</small><strong>AOIFE BRENNAN</strong></div>
          <dl className={s.grid}>
            <div><dt>Gate</dt><dd>4B</dd></div>
            <div><dt>Block</dt><dd>112</dd></div>
            <div><dt>Row · Seat</dt><dd>K · 18</dd></div>
            <div><dt>Doors</dt><dd>6:30 PM</dd></div>
            <div><dt>On stage</dt><dd>8:45 PM</dd></div>
            <div><dt>Date</dt><dd>14.03.27</dd></div>
          </dl>
        </section>

        <div className={s.perf} aria-hidden="true"><hr /></div>

        <section className={s.bottom}>
          {!revealed && unlock === 'face' && (
            <div className={`${s.fp} ${s[phase]}`}>
              <button type="button" className={s.fpBtn} aria-label="Verify it's you with Face ID to show your entry code" onClick={begin}>
                <span className={s.pulse} />
                <span className={s.core}>
                  <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: 'none' }} aria-hidden="true">
                    <circle className={s.track} cx="56" cy="56" r="46" />
                    <circle className={s.dots} cx="56" cy="56" r="46" />
                  </svg>
                  <span className={s.print} aria-hidden="true">
                    <svg className={s.glyph} width="52" height="52" viewBox="0 0 48 48">{FACE.map((d) => <path key={d} d={d} />)}</svg>
                    <svg className={s.check} width="52" height="52" viewBox="0 0 48 48"><path d="M14 24.5l7 7 13-14" /></svg>
                  </span>
                </span>
              </button>
              <div className={s.caption}>
                <strong>{COPY.face[phase as Exclude<Phase, 'revealed'>][0]}</strong>
                <small>{COPY.face[phase as Exclude<Phase, 'revealed'>][1]}</small>
              </div>
            </div>
          )}

          {!revealed && unlock === 'fingerprint' && (
            <div className={`${s.fp} ${s[phase]}`}>
              <button
                type="button"
                className={s.fpBtn}
                aria-label="Hold your finger here to unlock the entry barcode"
                onPointerDown={(e) => { try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} begin(); }}
                onPointerUp={cancel}
                onPointerLeave={cancel}
                onPointerCancel={cancel}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); begin(); } }}
              >
                <span className={s.pulse} />
                <span className={s.core}>
                  <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
                    <circle className={s.track} cx="56" cy="56" r="46" />
                    <circle className={s.ring} cx="56" cy="56" r="46" />
                  </svg>
                  <span className={s.print} aria-hidden="true">
                    <svg className={s.base} width="52" height="52" viewBox="0 0 24 24">{FINGERPRINT.map((d) => <path key={d} d={d} />)}</svg>
                    <svg className={s.fill} width="52" height="52" viewBox="0 0 24 24">{FINGERPRINT.map((d) => <path key={d} d={d} />)}</svg>
                  </span>
                </span>
              </button>
              <div className={s.caption}>
                <strong>{COPY.fingerprint[phase as Exclude<Phase, 'revealed'>][0]}</strong>
                <small>{COPY.fingerprint[phase as Exclude<Phase, 'revealed'>][1]}</small>
              </div>
            </div>
          )}

          {revealed && (
            <div key={`code-${reveal}`} className={s.code}>
              <button type="button" className={`${s.lock} ${s.fadeUp}`} onClick={reset}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                Lock
              </button>
              <div className={s.plate}>
                <div className={s.barcode} role="img" aria-label="Entry barcode">
                  {bars.map((b, i) => <i key={i} style={{ flexGrow: b.w, marginRight: b.g }} />)}
                  <span className={s.sweep} />
                </div>
              </div>
              <span className={`${s.digits} ${s.fadeUp}`} style={{ animationDelay: '.12s' }}>0471 2283 9910 5627</span>
            </div>
          )}
        </section>

        <div className={s.home} aria-hidden="true" />
      </div>
    </div>
  );
}
