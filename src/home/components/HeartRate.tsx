import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import s from './HeartRate.module.css';

/*
  Heart Rate — Playground piece
  A live heart-rate screen: dot-matrix BPM, a ring of dots that pulses at the
  current rate, and a background that shifts through the five training zones.
  Drag the slider at the bottom to simulate 50–180 BPM.
*/

const BASE_W = 390;
const BASE_H = 844;
const MIN_BPM = 50;
const MAX_BPM = 180;

// 5×7 dot-matrix glyphs
const GLYPHS: Record<string, string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
};

// BPM → hue: blue (rest) → teal → green → amber → orange → red (max)
const HUE_STOPS: [number, number][] = [
  [50, 220],
  [90, 195],
  [115, 165],
  [135, 42],
  [155, 18],
  [180, -8],
];

const ZONES = [
  { max: 89, label: 'ZONE 1 · RECOVERY', short: 'Z1', state: 'CALM' },
  { max: 119, label: 'ZONE 2 · AEROBIC', short: 'Z2', state: 'STEADY' },
  { max: 144, label: 'ZONE 3 · TEMPO', short: 'Z3', state: 'ELEVATED' },
  { max: 164, label: 'ZONE 4 · THRESHOLD', short: 'Z4', state: 'HIGH' },
  { max: Infinity, label: 'ZONE 5 · MAXIMUM', short: 'Z5', state: 'PEAK' },
];

// Placeholder last-12h history; the final bar is always the live reading.
const HISTORY = [62, 58, 66, 71, 84, 96, 78, 88, 142, 104, 93];
const PEAK_INDEX = 8;

const clamp = (n: number) => Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(n)));

function hueFor(bpm: number) {
  for (let i = 0; i < HUE_STOPS.length - 1; i++) {
    const [b0, h0] = HUE_STOPS[i];
    const [b1, h1] = HUE_STOPS[i + 1];
    if (bpm >= b0 && bpm <= b1) {
      const h = h0 + (h1 - h0) * ((bpm - b0) / (b1 - b0));
      return Math.round((h + 360) % 360);
    }
  }
  return HUE_STOPS[0][1];
}

// Ring dots are generated once with a fixed seed so every render matches.
const RING = (() => {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const N = 72;
  const motion = [s.m1, s.m2, s.m3, s.m4, s.m5, s.m6];
  return Array.from({ length: N }, (_, i) => ({
    angle: (i / N) * 360 - 90,
    motion: motion[Math.floor(rnd() * motion.length)],
    delay: rnd() * 0.05,
  }));
})();

const barBottom = (v: number) => Math.round(((Math.min(v, 185) - 45) / (185 - 45)) * 96);

type HeartRateProps = {
  /** Starting BPM (50–180). */
  initialBpm?: number;
  /** Rendered width in px; the 390×844 screen scales to fit. */
  width?: number;
  /** Corner radius of the device frame at full size. Set 0 for square. */
  radius?: number;
  /** Turn the heartbeat animation on or off. */
  pulse?: boolean;
  /** Fixed screen colour in place of the zone colour. */
  background?: string;
  className?: string;
};

export default function HeartRate({
  initialBpm = 90,
  width = BASE_W,
  radius = 44,
  pulse = true,
  background,
  className,
}: HeartRateProps) {
  const [bpm, setBpm] = useState(() => clamp(initialBpm));
  const [onScreen, setOnScreen] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const sliderId = useId();

  // Pause animations while the piece is scrolled out of view.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scale = width / BASE_W;
  const hue = hueFor(bpm);
  const zone = ZONES.find((z) => bpm <= z.max)!;
  const history = [...HISTORY, bpm];

  const screenStyle = {
    transform: scale === 1 ? undefined : `scale(${scale})`,
    backgroundColor: background ?? `hsl(${hue}, 55%, 23%)`,
    '--accent': `hsl(${hue}, 100%, 60%)`,
    '--accent-text': `hsl(${hue}, 100%, 76%)`,
    '--accent-soft': `hsla(${hue}, 100%, 60%, 0.18)`,
    '--beat': `${(60 / bpm).toFixed(3)}s`,
  } as CSSProperties;

  return (
    <div
      ref={frameRef}
      className={className ? `${s.frame} ${className}` : s.frame}
      style={{ width, height: BASE_H * scale, borderRadius: radius * scale }}
    >
      <div
        className={s.screen}
        style={screenStyle}
        data-paused={!onScreen || undefined}
        data-still={!pulse || undefined}
      >
        <div className={s.sheen} aria-hidden="true" />
        <div className={s.island} aria-hidden="true" />

        <div className={s.content}>
          <header className={s.header}>
            <div className={s.titleBlock}>
              <div className={s.eyebrow}>{zone.label}</div>
              <h2 className={s.title}>Heart Rate</h2>
              <div className={s.stats}>
                <span>REST 58</span>
                <span className={s.sep} aria-hidden="true">·</span>
                <span>LAST 12H</span>
                <span className={s.sep} aria-hidden="true">·</span>
                <span>AVG 74</span>
              </div>
            </div>
            <div className={s.pill}>
              <span className={s.liveDot} aria-hidden="true" />
              <span>ARM</span>
            </div>
          </header>

          <div className={s.ringWrap}>
            <div className={s.ringLayer} aria-hidden="true">
              {RING.map((d, i) => (
                <div key={i} className={s.spoke} style={{ transform: `rotate(${d.angle}deg)` }}>
                  <div
                    className={`${s.dot} ${d.motion}`}
                    style={{ animationDelay: `${d.delay.toFixed(3)}s` }}
                  />
                </div>
              ))}
            </div>

            <div className={s.center}>
              <div className={s.digits} role="img" aria-label={`${bpm} beats per minute`}>
                {String(bpm)
                  .split('')
                  .map((ch, di) => (
                    <div key={`${di}-${ch}`} className={s.digit}>
                      {GLYPHS[ch]
                        .join('')
                        .split('')
                        .map((v, ci) => (
                          <span key={ci} className={v === '1' ? s.on : s.off} />
                        ))}
                    </div>
                  ))}
              </div>
              <div className={s.bpmLine}>
                <span>BPM</span>
                <span className={s.slash}>/</span>
                <span>
                  STATE: <span className={s.state}>{zone.state}</span>
                </span>
              </div>
            </div>
          </div>

          <div className={s.chart}>
            <div className={s.bars}>
              {history.map((v, i) => {
                const b = barBottom(v);
                const isPeak = i === PEAK_INDEX;
                const isNow = i === history.length - 1;
                return (
                  <div key={i} className={s.col}>
                    {isPeak && (
                      <>
                        <div className={s.peakFill} style={{ height: b + 3 }} />
                        <div className={s.peakLabel} style={{ bottom: b + 10 }}>
                          PEAK 142
                        </div>
                      </>
                    )}
                    <div
                      className={isPeak || isNow ? `${s.bar} ${s.barAccent}` : s.bar}
                      style={{ bottom: b }}
                    />
                  </div>
                );
              })}
            </div>
            <div className={s.axis}>
              <span>06</span>
              <span>09</span>
              <span>12</span>
              <span>15</span>
              <span>NOW</span>
            </div>
          </div>

          <div className={s.spacer} />

          <div className={s.sim}>
            <div className={s.simHead}>
              <label htmlFor={sliderId} className={s.simLabel}>
                SIMULATE BPM
              </label>
              <span className={s.simValue}>
                {bpm} · {zone.short}
              </span>
            </div>
            <input
              id={sliderId}
              className={s.range}
              type="range"
              min={MIN_BPM}
              max={MAX_BPM}
              step={1}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
            />
            <div className={s.ticks} aria-hidden="true">
              <span>50</span>
              <span>Z1</span>
              <span>Z2</span>
              <span>Z3</span>
              <span>Z4</span>
              <span>Z5</span>
              <span>180</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
