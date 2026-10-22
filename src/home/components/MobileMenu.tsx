import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCopyEmail } from '../hooks'
import { Brand, EMAIL, LINKEDIN } from './SiteHeader'

type MobileMenuProps = {
  onClose: () => void
  onAbout: () => void
}

export function MobileMenu({ onClose, onAbout }: MobileMenuProps) {
  const { copied, copy } = useCopyEmail(EMAIL)
  const closeRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
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
    <div ref={menuRef} className="hm-menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="hm-menu__top">
        <Brand />
        <button
          ref={closeRef}
          type="button"
          className="hm-iconbtn hm-menu__close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <svg width="32" height="32" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 2 L18 18 M18 2 L2 18" />
          </svg>
        </button>
      </div>
      <nav className="hm-menu__links" aria-label="Primary">
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
        <a className="hm-navlink" href={LINKEDIN} target="_blank" rel="noopener noreferrer" onClick={onClose}>
          LinkedIn
        </a>
        <Link className="hm-navlink" to="/playground" onClick={onClose}>
          <span className="hm-emoji" aria-hidden="true">
            👾
          </span>
          Playground
        </Link>
      </nav>
    </div>
  )
}
