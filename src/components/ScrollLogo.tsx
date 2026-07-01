import { type MouseEvent, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/** Fixed brand logo, top-left, that fades in once the page is scrolled down. */
export function ScrollLogo() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 220)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // go home; if already on the homepage, smooth-scroll to the very top
  const goHome = (e: MouseEvent) => {
    e.preventDefault()
    if (window.location.hash !== '#/' && window.location.hash !== '') {
      window.location.hash = '#/'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.a
      href="#/"
      onClick={goHome}
      className="scroll-logo"
      aria-label="Gavan Duffy — home"
      initial={false}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : -8 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.6 }}
      style={{ pointerEvents: shown ? 'auto' : 'none' }}
    >
      <span style={{ fontFamily: 'var(--display)', fontSize: '21px', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1, color: '#1825AA' }}>GAV®</span>
    </motion.a>
  )
}
