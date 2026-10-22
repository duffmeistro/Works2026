import { useEffect, useRef } from 'react'
import { useCopyEmail } from '../hooks'
import { EMAIL, LINKEDIN } from './SiteHeader'

type MobileMenuProps = {
  onClose: () => void
  onAbout: () => void
}

export function MobileMenu({ onClose, onAbout }: MobileMenuProps) {
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
          <button type="button" className="hm-mitem" onClick={onAbout}>
            About
          </button>
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
          <a className="hm-mitem" href={LINKEDIN} target="_blank" rel="noopener noreferrer" onClick={onClose}>
            LinkedIn
          </a>
        </nav>
      </div>
    </>
  )
}
