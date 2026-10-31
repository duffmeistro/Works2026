import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './VoiceRecorder.module.css';

/*
 * Voice Recorder — playground piece
 * A self-contained, interactive React component. No dependencies beyond React.
 *
 * The waveform strip is moved with a transform written straight to the DOM each
 * animation frame, and React only re-renders when a new half-second bar appears.
 * That keeps the scroll perfectly linear without re-rendering 60 times a second.
 */

type Status = 'rec' | 'paused' | 'saved';

const COLS = 66; // bars rendered across the strip
const COL_W = 6; // px per bar slot
const CENTER = 33; // index of the column under the playhead
const STEP_MS = 500; // each bar = half a second of audio
const LABEL_EVERY = 20; // label every 20 bars = every 10 seconds

export type VoiceRecorderProps = {
  /** Playhead, record button and status dot colour. */
  accent?: string;
  /** Where the timer starts, in seconds. */
  startSeconds?: number;
  /** Start recording on mount (true) or sit paused (false). */
  autoStart?: boolean;
  /** Uniform scale of the whole 390×844 device, e.g. 0.75 for a smaller card. */
  scale?: number;
  title?: string;
  dateLabel?: string;
  className?: string;
};

function pad(n: number) {
  return (n < 10 ? '0' : '') + n;
}

function labelFor(seconds: number) {
  return Math.floor(seconds / 60) + ':' + pad(seconds % 60);
}

/** Deterministic, speech-like amplitude for bar n (same bar always looks the same). */
function amp(n: number) {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  const r = s - Math.floor(s);
  if (Math.sin(n * 0.11) > 0.86) return 3; // little pauses between phrases
  const env = 0.35 + 0.65 * Math.abs(Math.sin(n * 0.23) * Math.sin(n * 0.071 + 1));
  return Math.max(4, Math.round(8 + 76 * env * (0.3 + 0.7 * r)));
}

export default function VoiceRecorder({
  accent = '#FF5735',
  startSeconds = 167,
  autoStart = true,
  scale = 1,
  title = 'New Recording 04',
  dateLabel = 'Today · 17:08',
  className,
}: VoiceRecorderProps) {
  const [status, setStatus] = useState<Status>(autoStart ? 'rec' : 'paused');
  const [half, setHalf] = useState(() => Math.floor((startSeconds * 1000) / STEP_MS));

  const msRef = useRef(startSeconds * 1000);
  const statusRef = useRef<Status>(status);
  const stripRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  statusRef.current = status;

  const applyTransform = useCallback(() => {
    const frac = (msRef.current % STEP_MS) / STEP_MS;
    if (stripRef.current) {
      stripRef.current.style.transform = `translate3d(${(-COL_W - frac * COL_W).toFixed(2)}px,0,0)`;
    }
  }, []);

  // Animation loop: advance time while recording and on screen.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (statusRef.current === 'rec' && visibleRef.current) {
        msRef.current += dt;
        const h = Math.floor(msRef.current / STEP_MS);
        setHalf((prev) => (prev === h ? prev : h));
        applyTransform();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyTransform]);

  // Don't burn frames when the card is scrolled off screen on the playground page.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reset = useCallback(
    (next: Status) => {
      msRef.current = 0;
      setHalf(0);
      setStatus(next);
      applyTransform();
    },
    [applyTransform],
  );

  const atZero = half === 0 && msRef.current === 0 && status !== 'rec';

  const onMain = () => {
    if (status === 'rec') setStatus('paused');
    else if (status === 'paused') setStatus('rec');
    else reset('rec');
  };
  const onDelete = () => reset('paused');
  const onDone = () => {
    if (msRef.current > 0) setStatus('saved');
  };

  // Timer text, one fixed-width slot per character so it never shifts sideways.
  const sec = Math.floor(half / 2);
  const time = pad(Math.floor(sec / 60)) + ':' + pad(sec % 60);

  const cols = useMemo(() => {
    const out: { key: number; kind: 'rec' | 'tick' | 'none'; h: number; label?: string }[] = [];
    for (let k = 0; k < COLS; k++) {
      const n = half + (k - CENTER);
      if (n < 0) {
        out.push({ key: n, kind: 'none', h: 0 });
        continue;
      }
      const label = n % LABEL_EVERY === 0 ? labelFor(n / 2) : undefined;
      if (n <= half) out.push({ key: n, kind: 'rec', h: amp(n), label });
      else out.push({ key: n, kind: 'tick', h: n % LABEL_EVERY === 0 ? 34 : 20, label });
    }
    return out;
  }, [half]);

  const statusText =
    status === 'rec'
      ? 'Recording · iPhone Mic'
      : status === 'saved'
        ? 'Saved to Recordings'
        : atZero
          ? 'Ready · iPhone Mic'
          : 'Paused · iPhone Mic';

  const mainLabel = status === 'rec' ? 'Pause' : atZero ? 'Record' : status === 'paused' ? 'Resume' : 'Record';

  return (
    <div
      className={[styles.frame, className].filter(Boolean).join(' ')}
      style={{ width: 390 * scale, height: 844 * scale }}
    >
      <div
        ref={rootRef}
        className={styles.device}
        style={{ transform: scale === 1 ? undefined : `scale(${scale})`, ['--vr-accent' as string]: accent }}
        role="region"
        aria-label="Voice recorder demo"
      >
        <div className={styles.island} aria-hidden="true" />

        <div className={styles.topBar}>
          <button type="button" className={styles.back} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" className={styles.pill}>Recordings</button>
        </div>

        <div className={styles.timerBlock}>
          <div className={styles.timer} aria-label={`Elapsed ${time}`}>
            {time.split('').map((c, i) => (
              <span key={i} className={c === ':' ? styles.colon : styles.digit} aria-hidden="true">
                {c}
              </span>
            ))}
          </div>
          <div className={styles.status}>
            {status === 'rec' && <span className={styles.recDot} />}
            <span>{statusText}</span>
          </div>
        </div>

        <div className={styles.timeline} aria-hidden="true">
          <div ref={stripRef} className={styles.strip} style={{ transform: `translate3d(${-COL_W}px,0,0)` }}>
            {cols.map((c) => (
              <div key={c.key} className={styles.col}>
                {c.kind !== 'none' && (
                  <span
                    className={c.kind === 'rec' ? styles.bar : styles.tick}
                    style={{ height: c.h }}
                  />
                )}
                {c.label && <span className={styles.label}>{c.label}</span>}
              </div>
            ))}
          </div>
          <div className={styles.playhead} />
        </div>

        <div className={styles.spacer} />

        <div className={styles.meta}>
          <div className={styles.date}>{dateLabel}</div>
          <div className={styles.title}>{title}</div>
        </div>

        <div className={styles.controls}>
          <button type="button" className={`${styles.side} ${styles.sideLeft}`} onClick={onDelete} aria-label="Delete recording">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7V4h6v3" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.main} ${atZero ? styles.mainArmed : ''}`}
            onClick={onMain}
            aria-label={mainLabel}
          >
            {status !== 'rec' && !atZero && <span className={styles.mainDot} />}
            {status !== 'rec' && <span>{mainLabel}</span>}
            {status === 'rec' && (
              <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="4" width="4.5" height="16" rx="1.2" fill="currentColor" />
                <rect x="14.5" y="4" width="4.5" height="16" rx="1.2" fill="currentColor" />
              </svg>
            )}
          </button>
          <button type="button" className={`${styles.side} ${styles.sideRight}`} onClick={onDone} aria-label="Done, save recording">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
