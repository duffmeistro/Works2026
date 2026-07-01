import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { label: 'Works', href: '#works' },
  { label: 'About', href: '#about' },
  { label: 'Connect', href: '#contact' },
]

/** Fixed top-right nav: a segmented control on desktop, a hamburger + panel on mobile. */
export function Menu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div className="menu" ref={ref}>
      {/* desktop: segmented control */}
      <nav className="segmented" aria-label="Primary">
        {items.map((it) => (
          <a key={it.href} className="seg" href={it.href}>{it.label}</a>
        ))}
      </nav>

      {/* mobile: hamburger toggles the panel */}
      <button
        className="menu__burger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu__panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            {items.map((it) => (
              <a
                key={it.href}
                className="menu__panel-link"
                href={it.href}
                onClick={() => setOpen(false)}
              >
                {it.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
