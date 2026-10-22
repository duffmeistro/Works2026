import { Link } from 'react-router-dom'
import { useCopyEmail } from '../hooks'

export const EMAIL = 'duffyarch@gmail.com'
export const LINKEDIN = 'https://ie.linkedin.com/in/gavan-duffy'

export function Brand() {
  return (
    <div className="hm-brand">
      <div>Gavan Duffy</div>
      <div>Senior Product Designer</div>
      <div className="hm-brand__sub">works [26]</div>
    </div>
  )
}

type SiteHeaderProps = {
  onAbout: () => void
  onOpenMenu: () => void
  menuOpen: boolean
}

export function SiteHeader({ onAbout, onOpenMenu, menuOpen }: SiteHeaderProps) {
  const { copied, copy } = useCopyEmail(EMAIL)
  return (
    <>
      <header className="hm-header">
        <Brand />
        <button
          type="button"
          className="hm-iconbtn hm-menubtn"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={onOpenMenu}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
            {[0, 7.25, 14.5].flatMap((y) =>
              [0, 7.25, 14.5].map((x) => (
                <rect key={`${x}-${y}`} x={x} y={y} width="5.5" height="5.5" />
              )),
            )}
          </svg>
        </button>
      </header>
      <nav className="hm-nav" aria-label="Primary">
        <button type="button" className="hm-navbtn" onClick={onAbout}>
          About
        </button>
        <button
          type="button"
          className="hm-navbtn"
          aria-label={copied ? 'Email address copied' : 'Copy email address'}
          onClick={copy}
        >
          {copied ? 'Copied!' : 'Email'}
        </button>
        <span className="hm-sr" role="status">
          {copied ? 'Email address copied' : ''}
        </span>
        <a className="hm-navlink" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <Link className="hm-navlink" to="/playground">
          <span className="hm-emoji" aria-hidden="true">
            👾
          </span>
          Playground
        </Link>
      </nav>
    </>
  )
}
