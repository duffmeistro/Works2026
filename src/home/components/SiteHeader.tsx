import { Link } from 'react-router-dom'
import { useActiveProject } from '../ActiveProject'
import { useCopyEmail } from '../hooks'
import { ModeButton } from './ModeButton'

export const EMAIL = 'duffyarch@gmail.com'
export const LINKEDIN = 'https://ie.linkedin.com/in/gavan-duffy'
export const SHOW_ABOUT = true
export const SHOW_EMAIL = false
export const STUDY_LABEL = 'Case study'

export function Brand() {
  const { setActive } = useActiveProject()
  return (
    <Link className="hm-brand" to="/" aria-label="Gavan Duffy, Senior Product Designer: home" onClick={() => setActive(0)}>
      <div>Gavan Duffy_</div>
      <div>Senior _ Product Designer</div>
      <div className="hm-brand__sub">_works [26]</div>
    </Link>
  )
}

type SiteHeaderProps = {
  onAbout: () => void
  onCaseStudy: () => void
  onToggleMenu: () => void
  menuOpen: boolean
}

export function SiteHeader({ onAbout, onCaseStudy, onToggleMenu, menuOpen }: SiteHeaderProps) {
  const { copied, copy } = useCopyEmail(EMAIL)
  return (
    <>
      <header className="hm-header">
        <Brand />
        <div className="hm-header__actions">
          <ModeButton placement="header" />
          <button
            type="button"
            className={menuOpen ? 'hm-iconbtn hm-menubtn is-open' : 'hm-iconbtn hm-menubtn'}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={onToggleMenu}
          >
            <svg className="hm-mi hm-mi--x" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2 L18 18 M18 2 L2 18" />
            </svg>
            <svg className="hm-mi hm-mi--grid" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
              {[0, 7.25, 14.5].flatMap((y) =>
                [0, 7.25, 14.5].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="5.5" height="5.5" />),
              )}
            </svg>
          </button>
        </div>
      </header>
      <nav className="hm-nav" aria-label="Primary">
        {SHOW_ABOUT && (
          <button type="button" className="hm-navbtn" onClick={onAbout}>
            About
          </button>
        )}
        {SHOW_EMAIL && (
          <>
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
          </>
        )}
        <a className="hm-navlink" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <button type="button" className="hm-navbtn" onClick={onCaseStudy}>
          {STUDY_LABEL}
        </button>
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
