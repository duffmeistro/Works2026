// Small inline SVGs for badges, tool tiles and link arrows.

export const Sparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
  </svg>
)

export const Diamond = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 3 21 12 12 21 3 12z" />
    <path d="M12 7.5 16.5 12 12 16.5 7.5 12z" />
  </svg>
)

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 4v16M4 12h16" />
  </svg>
)

export const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

/* Tool tiles — stylised brand-ish marks */
export const ClaudeTile = () => (
  <div className="tool" style={{ background: '#d97757' }}>
    <svg viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6
        return <line key={i} x1={12} y1={12} x2={12 + 8 * Math.cos(a)} y2={12 + 8 * Math.sin(a)} />
      })}
    </svg>
  </div>
)

export const ConductorTile = () => (
  <div className="tool" style={{ background: '#0a0a0a' }}>
    <svg viewBox="0 0 24 24" fill="#fff">
      <rect x="6" y="5" width="9" height="3.4" rx="1" />
      <rect x="6" y="10.3" width="12" height="3.4" rx="1" />
      <rect x="6" y="15.6" width="7" height="3.4" rx="1" />
    </svg>
  </div>
)

export const GeminiTile = () => (
  <div className="tool tool--light" style={{ background: '#fff' }}>
    <svg viewBox="0 0 24 24">
      <defs>
        <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f94877" />
          <stop offset="0.5" stopColor="#9b6dff" />
          <stop offset="1" stopColor="#4ea0ff" />
        </linearGradient>
      </defs>
      <path d="M12 2c.3 5.2 4.6 9.5 9.8 9.8C16.6 12.1 12.3 16.4 12 21.6 11.7 16.4 7.4 12.1 2.2 11.8 7.4 11.5 11.7 7.2 12 2z" fill="url(#gem)" />
    </svg>
  </div>
)

export const FigmaTile = () => (
  <div className="tool" style={{ background: '#0a0a0a' }}>
    <svg viewBox="0 0 24 24">
      <path d="M9 3h3v6H9a3 3 0 1 1 0-6z" fill="#f24e1e" />
      <path d="M12 3h3a3 3 0 1 1 0 6h-3z" fill="#ff7262" />
      <path d="M9 9h3v6H9a3 3 0 1 1 0-6z" fill="#a259ff" />
      <circle cx="15" cy="12" r="3" fill="#1abcfe" />
      <path d="M9 15h3v3a3 3 0 1 1-3-3z" fill="#0acf83" />
    </svg>
  </div>
)

export const ChromeTile = () => (
  <div className="tool tool--light" style={{ background: '#fff' }}>
    <svg viewBox="0 0 24 24">
      <path d="M12 4.8A7.2 7.2 0 0 1 18.24 8H12a4 4 0 0 0-3.46 2L5.64 5.76A11.18 11.18 0 0 1 12 4.8z" fill="#ea4335" />
      <path d="M19.27 9.6a7.2 7.2 0 0 1-3.54 9.58l-3.24-5.6A4 4 0 0 0 16 12h3.27z" fill="#34a853" />
      <path d="M8.26 19.18a7.2 7.2 0 0 1-3.54-9.58H8a4 4 0 0 0 3.54 5.82l-3.28 3.76z" fill="#fbbc05" />
      <circle cx="12" cy="12" r="2.6" fill="#4285f4" />
      <circle cx="12" cy="12" r="1.6" fill="#fff" />
    </svg>
  </div>
)

export const LinearTile = () => (
  <div className="tool tool--light" style={{ background: '#fff' }}>
    <svg viewBox="0 0 24 24" stroke="#5b5bef" strokeWidth="1.6" strokeLinecap="round">
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * Math.PI) / 6
        return <line key={i} x1={12} y1={12} x2={12 + 8 * Math.cos(a)} y2={12 + 8 * Math.sin(a)} />
      })}
      <circle cx="12" cy="12" r="2.4" fill="#5b5bef" stroke="none" />
    </svg>
  </div>
)
