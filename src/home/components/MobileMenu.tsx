import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCopyEmail } from '../hooks'
import { EMAIL, LINKEDIN, SHOW_ABOUT, SHOW_EMAIL, STUDY_LABEL } from './SiteHeader'

type MobileMenuProps = {
  onClose: () => void
  onAbout: () => void
  onCaseStudy: () => void
}

export function MobileMenu({ onClose, onAbout, onCaseStudy }: MobileMenuProps) {
  const { copied, copy } = useCopyEmail(EMAIL)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    menuRef.current?.querySelector<HTMLElement>('.hm-mitem')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const nodes = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <button type="button" className="hm-menu-scrim" tabIndex={-1} aria-label="Close menu" onClick={onClose} />
      <div ref={menuRef} className="hm-menu" role="dialog" aria-label="Menu">
        <nav className="hm-menu__links" aria-label="Primary">
          {SHOW_ABOUT && (
            <button type="button" className="hm-mitem" onClick={onAbout}>
              About
            </button>
          )}
          {SHOW_EMAIL && (
            <>
              <button
                type="button"
                className="hm-mitem"
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
          <a className="hm-mitem" href={LINKEDIN} target="_blank" rel="noopener noreferrer" onClick={onClose}>
            LinkedIn
          </a>
          <button type="button" className="hm-mitem" onClick={onCaseStudy}>
            {STUDY_LABEL}
          </button>
          <Link className="hm-mitem" to="/playground" onClick={onClose}>
            <span className="hm-emoji" aria-hidden="true">
              👾
            </span>
            Playground
          </Link>
        </nav>
      </div>
    </>
  )
}
