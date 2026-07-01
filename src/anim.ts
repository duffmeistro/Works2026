import type { Variants, Transition } from 'framer-motion'

// Reproduces Framer's "Appear" reveal used on sylven.framer.website:
// fade + slide-up, settled with a smooth (no-overshoot) spring.
export const SPRING: Transition = { type: 'spring', stiffness: 200, damping: 40 }

// container that staggers its children's reveal
export const stagger = (staggerChildren = 0.12, delayChildren = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

// a single element that rises into place (Framer uses 24/40/48/64px offsets)
export const rise = (y = 40): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: SPRING },
})

// scroll-reveal viewport: play once, slightly before fully in view
export const viewportOnce = { once: true, margin: '-12% 0px' } as const
