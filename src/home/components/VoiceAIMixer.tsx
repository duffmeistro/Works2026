/**
 * VoiceAI — gradient mixer
 * A 390×844 phone prototype: three faders drive three colours in an animated,
 * grainy gradient field. Tap a hex chip to open a dark bottom sheet with a
 * colour wheel. No dependencies beyond React.
 */

import React, { useId, useMemo, useRef, useState } from 'react';

type Drift = 'calm' | 'lively' | 'off';
type HSL = { h: number; s: number; l: number };

export type VoiceAIMixerProps = {
  /** Starting colours for ash, coral and haze. */
  colors?: [string, string, string];
  /** Starting fader levels, 0–100. */
  levels?: [number, number, number];
  /** Background motion. */
  drift?: Drift;
  /** Grain strength, 0–1. */
  grain?: number;
  /** Wordmark lines. */
  title?: string;
  subtitle?: [string, string];
  /** Round the corners like a device screen. */
  rounded?: boolean;
  /** Drive the faders from outside, e.g. for a looping preview. */
  liveLevels?: [number, number, number];
  className?: string;
  style?: React.CSSProperties;
};

const NAMES = ['ash', 'coral', 'haze'] as const;
const DEFAULT_COLORS: [string, string, string] = ['#7A7A78', '#F4A396', '#B9C6D6'];
const SUGGESTED: string[][] = [
  ['#7A7A78', '#4E5A66', '#8C7B6B'],
  ['#F4A396', '#E9B872', '#D98BA8'],
  ['#B9C6D6', '#CFC3E0', '#C9D6C2'],
];

const INK = '#1C1C1B';
const MUTED = '#5F5F5C';
const BUTTON_BG = '#E0E0DD';
const HANDLE = '#2E2E2D';

function hexToHsl(hex: string): HSL {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + to(f(0)) + to(f(8)) + to(f(4));
}

// Blob geometry inside the 390×432 field: each level drives size and presence.
const GEO = [
  { cx: -20, cy: 470, base: 300, grow: 2.6, blur: 10, soft: false },
  { cx: 330, cy: 300, base: 180, grow: 3.4, blur: 56, soft: true },
  { cx: 110, cy: 40, base: 160, grow: 3.2, blur: 64, soft: true },
];
const MOTION = [
  { name: 'vam-a', dur: 16, delay: 0 },
  { name: 'vam-b', dur: 12, delay: -4 },
  { name: 'vam-c', dur: 19, delay: -9 },
];

const CSS = `
.vam-root button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.vam-root button:focus-visible{outline:2px solid ${INK};outline-offset:2px;border-radius:8px}
.vam-sheet button:focus-visible{outline-color:#F2F2EF}
.vam-fader-input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ns-resize;writing-mode:vertical-lr;direction:rtl}
.vam-fader:has(.vam-fader-input:focus-visible) .vam-thumb{outline:2px solid ${INK};outline-offset:3px}
.vam-light{-webkit-appearance:none;appearance:none;position:absolute;inset:0;width:100%;height:100%;margin:0;background:transparent;cursor:pointer}
.vam-light::-webkit-slider-runnable-track{height:100%;background:transparent}
.vam-light::-moz-range-track{height:100%;background:transparent}
.vam-light::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;margin-top:10px;border-radius:50%;background:#F2F2EF;border:3px solid ${INK};box-shadow:0 0 0 1px rgba(255,255,255,.4)}
.vam-light::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#F2F2EF;border:3px solid ${INK}}
.vam-light:focus-visible{outline:2px solid #F2F2EF;outline-offset:4px;border-radius:8px}
@keyframes vam-a{0%{transform:translate(0,0) scale(1)}50%{transform:translate(34px,-22px) scale(1.06)}100%{transform:translate(-18px,12px) scale(.97)}}
@keyframes vam-b{0%{transform:translate(0,0) scale(1)}35%{transform:translate(-52px,34px) scale(1.14)}70%{transform:translate(-10px,-30px) scale(.92)}100%{transform:translate(24px,18px) scale(1.05)}}
@keyframes vam-c{0%{transform:translate(0,0) scale(1)}40%{transform:translate(64px,30px) scale(1.12)}100%{transform:translate(-26px,52px) scale(.96)}}
@keyframes vam-grain{0%{transform:translate(0,0)}20%{transform:translate(-3%,2%)}40%{transform:translate(2%,-3%)}60%{transform:translate(-2%,-1%)}80%{transform:translate(3%,3%)}100%{transform:translate(0,0)}}
@media (prefers-reduced-motion: reduce){.vam-blob,.vam-grain{animation:none!important}.vam-sheet,.vam-scrim{transition:none!important}}
`;

export default function VoiceAIMixer({
  colors: initialColors = DEFAULT_COLORS,
  levels: initialLevels = [62, 78, 40],
  drift = 'calm',
  grain = 0.6,
  title = 'VoiceAI',
  subtitle = ['gradient', 'mixer'],
  rounded = true,
  liveLevels,
  className,
  style,
}: VoiceAIMixerProps) {
  const [levels, setLevels] = useState<number[]>([...initialLevels]);
  const [muted, setMuted] = useState<boolean[]>([false, false, false]);
  const [colors, setColors] = useState<string[]>([...initialColors]);
  const [sheet, setSheet] = useState(1);
  const [open, setOpen] = useState(false);
  const [hsl, setHsl] = useState<HSL>(() => hexToHsl(initialColors[1]));
  const dragging = useRef(false);
  const grainId = useRef('vam-grain-' + Math.random().toString(36).slice(2, 8)).current;
  const lightId = useId();

  const eff = (liveLevels ?? levels).map((l, i) => (muted[i] ? 0 : l));
  const speed = drift === 'lively' ? 0.45 : 1;

  const setLevel = (i: number, v: number) => {
    setLevels((ls) => ls.map((l, j) => (j === i ? v : l)));
    setMuted((ms) => ms.map((m, j) => (j === i ? false : m)));
  };

  const applyHsl = (next: HSL) => {
    setHsl(next);
    const hex = hslToHex(next.h, next.s, next.l);
    setColors((cs) => cs.map((c, j) => (j === sheet ? hex : c)));
  };

  const pickFromPointer = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    const dist = Math.min(1, Math.sqrt(x * x + y * y));
    const h = Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360);
    applyHsl({ h, s: Math.round(dist * 100), l: hsl.l });
  };

  const openSheet = (i: number) => {
    setSheet(i);
    setHsl(hexToHsl(colors[i]));
    setOpen(true);
  };

  // Picker visuals
  const R = 116;
  const M = 12;
  const rad = (hsl.h * Math.PI) / 180;
  const L = hsl.l;
  const pickHex = colors[sheet];
  const hueStops = [0, 60, 120, 180, 240, 300, 360].map((h) => `hsl(${h}, 100%, ${L}%)`).join(', ');
  const wheelBg = `radial-gradient(circle closest-side, hsl(0, 0%, ${L}%) 0%, hsla(0, 0%, ${L}%, 0) 100%), conic-gradient(from 90deg, ${hueStops})`;
  const lightBg = `linear-gradient(90deg, hsl(${hsl.h}, ${hsl.s}%, 5%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 95%))`;
  const markerX = Math.round(R + Math.cos(rad) * (hsl.s / 100) * (R - M) - M);
  const markerY = Math.round(R + Math.sin(rad) * (hsl.s / 100) * (R - M) - M);

  const blobs = useMemo(
    () =>
      [2, 1, 0].map((i) => {
        const g = GEO[i];
        const m = MOTION[i];
        const d = Math.round(g.base + eff[i] * g.grow);
        const c = colors[i];
        return {
          key: i,
          style: {
            position: 'absolute',
            borderRadius: '50%',
            left: Math.round(g.cx - d / 2),
            top: Math.round(g.cy - d / 2),
            width: d,
            height: d,
            background: g.soft ? `radial-gradient(circle, ${c} 0%, ${c} 40%, transparent 72%)` : c,
            opacity: eff[i] / 100,
            filter: `blur(${g.blur}px)`,
            willChange: 'transform',
            animation:
              drift === 'off'
                ? 'none'
                : `${m.name} ${(m.dur * speed).toFixed(1)}s ease-in-out ${(m.delay * speed).toFixed(1)}s infinite alternate`,
            transition: 'left 260ms ease-out, top 260ms ease-out, width 260ms ease-out, height 260ms ease-out, opacity 260ms ease-out',
          } as React.CSSProperties,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eff.join(','), colors.join(','), drift, speed]
  );

  const trackH = 150;
  const thumbH = 34;

  return (
    <div
      className={'vam-root' + (className ? ' ' + className : '')}
      style={{
        width: 390,
        height: 844,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: rounded ? 48 : 0,
        background: '#EDEDEB',
        fontFamily: "'Inter Tight', system-ui, sans-serif",
        color: INK,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      <style>{CSS}</style>

      {/* Gradient field */}
      <div
        style={{
          position: 'relative',
          height: 432,
          flexShrink: 0,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #E7E6E4 0%, #DAD8D5 100%)',
        }}
      >
        {blobs.map((b) => (
          <div key={b.key} className="vam-blob" aria-hidden="true" style={b.style} />
        ))}
        <svg
          className="vam-grain"
          aria-hidden="true"
          width="120%"
          height="120%"
          style={{
            position: 'absolute',
            left: '-10%',
            top: '-10%',
            mixBlendMode: 'overlay',
            opacity: grain,
            pointerEvents: 'none',
            animation: drift === 'off' ? 'none' : 'vam-grain 0.9s steps(1) infinite',
          }}
        >
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
        {/* Dynamic Island */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 11,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 126,
            height: 37,
            borderRadius: 20,
            background: '#000',
            zIndex: 10,
          }}
        />
      </div>

      {/* Control panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '4px 20px 40px 20px',
          boxSizing: 'border-box',
          borderTop: '1px solid #DCDCD9',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 22, lineHeight: '20px', letterSpacing: '-0.04em', fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: 22, lineHeight: '22px', letterSpacing: '-0.04em', fontWeight: 300 }}>
              {subtitle[0]}
              <span style={{ fontWeight: 600 }}>{subtitle[1]}</span>
            </div>
          </div>
          <div style={{ fontSize: 12, lineHeight: '20px', color: MUTED }}>3 channels</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginTop: 18 }}>
          {NAMES.map((name, i) => {
            const v = eff[i];
            const isOn = !muted[i];
            return (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                <div style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', textAlign: 'center', marginBottom: 2 }}>{v}</div>

                <div className="vam-fader" style={{ position: 'relative', width: 64, height: trackH, alignSelf: 'center', marginBottom: 4 }}>
                  <div aria-hidden="true" style={{ position: 'absolute', left: 29, top: 0, bottom: 0, width: 6, background: '#D6D6D2', borderRadius: 3 }} />
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 29,
                      bottom: 0,
                      width: 6,
                      height: Math.round((v / 100) * (trackH - thumbH) + thumbH / 2),
                      background: colors[i],
                      borderRadius: 3,
                    }}
                  />
                  <div
                    className="vam-thumb"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 17,
                      top: Math.round((1 - v / 100) * (trackH - thumbH)),
                      width: 30,
                      height: thumbH,
                      borderRadius: 8,
                      background: HANDLE,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      pointerEvents: 'none',
                    }}
                  >
                    <div style={{ width: 12, height: 2, background: '#9C9C99', borderRadius: 1 }} />
                    <div style={{ width: 12, height: 2, background: '#9C9C99', borderRadius: 1 }} />
                  </div>
                  <input
                    className="vam-fader-input"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={v}
                    aria-label={`${name} level`}
                    onChange={(e) => setLevel(i, parseInt(e.target.value, 10))}
                  />
                </div>

                <button
                  role="switch"
                  aria-checked={isOn}
                  aria-label={name}
                  onClick={() => setMuted((ms) => ms.map((m, j) => (j === i ? !m : m)))}
                  style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'relative',
                      width: 34,
                      height: 20,
                      borderRadius: 10,
                      background: isOn ? HANDLE : '#C9C9C5',
                      transition: 'background 200ms ease',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: isOn ? 16 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                        transition: 'left 200ms ease',
                      }}
                    />
                  </span>
                </button>

                <button
                  onClick={() => openSheet(i)}
                  aria-label={`Edit ${name} colour, ${colors[i].toUpperCase()}`}
                  style={{
                    height: 44,
                    padding: '0 8px',
                    borderRadius: 8,
                    background: BUTTON_BG,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ width: 10, height: 10, flexShrink: 0, borderRadius: 3, background: colors[i], boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}
                  />
                  <span style={{ fontSize: 12, color: '#3F3F3D', fontVariantNumeric: 'tabular-nums' }}>{colors[i].toUpperCase()}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Home indicator */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: INK }}
        />
      </div>

      {/* Scrim */}
      <button
        className="vam-scrim"
        aria-label="Close colour picker"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          background: 'rgba(20, 20, 19, 0.4)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Colour picker sheet */}
      <div
        className="vam-sheet"
        role="dialog"
        aria-label="Colour picker"
        aria-hidden={!open}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 520,
          zIndex: 6,
          boxSizing: 'border-box',
          padding: '10px 24px 0 24px',
          borderRadius: '28px 28px 0 0',
          background: INK,
          color: '#F2F2EF',
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(${open ? '0' : '104%'})`,
          visibility: open ? 'visible' : 'hidden',
          transition: 'transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1), visibility 380ms',
        }}
      >
        <div aria-hidden="true" style={{ width: 36, height: 5, borderRadius: 3, background: '#4A4A48', alignSelf: 'center' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 44, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 4, background: pickHex }} />
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em' }}>{NAMES[sheet]}</span>
            <span style={{ fontSize: 13, color: '#A3A3A0', fontVariantNumeric: 'tabular-nums' }}>{pickHex.toUpperCase()}</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ height: 44, padding: '0 14px', borderRadius: 8, background: '#2E2E2D', fontSize: 13 }}
          >
            done
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <button
            aria-label="Colour wheel: drag to choose hue and saturation"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture?.(e.pointerId);
              pickFromPointer(e);
            }}
            onPointerMove={(e) => {
              if (dragging.current) pickFromPointer(e);
            }}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            style={{
              position: 'relative',
              width: 232,
              height: 232,
              borderRadius: '50%',
              touchAction: 'none',
              cursor: 'crosshair',
              background: wheelBg,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: markerX,
                top: markerY,
                width: 24,
                height: 24,
                borderRadius: '50%',
                boxSizing: 'border-box',
                border: '3px solid #F2F2EF',
                background: pickHex,
                boxShadow: '0 2px 8px rgba(0,0,0,0.45)',
                pointerEvents: 'none',
              }}
            />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, fontSize: 12 }}>
          <label htmlFor={lightId} style={{ color: '#A3A3A0' }}>
            lightness
          </label>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{hsl.l}%</span>
        </div>
        <div style={{ position: 'relative', height: 44, marginTop: 2 }}>
          <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 14, height: 16, borderRadius: 8, background: lightBg }} />
          <input
            id={lightId}
            className="vam-light"
            type="range"
            min={5}
            max={95}
            step={1}
            value={hsl.l}
            onChange={(e) => applyHsl({ h: hsl.h, s: hsl.s, l: parseInt(e.target.value, 10) })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <span style={{ fontSize: 12, color: '#A3A3A0' }}>suggested</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {SUGGESTED[sheet].map((hex) => {
              const active = hex.toLowerCase() === pickHex.toLowerCase();
              return (
                <button
                  key={hex}
                  aria-label={`Use ${hex.toUpperCase()}`}
                  onClick={() => {
                    setColors((cs) => cs.map((c, j) => (j === sheet ? hex : c)));
                    setHsl(hexToHsl(hex));
                  }}
                  style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: hex,
                      boxShadow: active ? `0 0 0 2px ${INK}, 0 0 0 4px #F2F2EF` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: '#F2F2EF' }}
        />
      </div>
    </div>
  );
}
