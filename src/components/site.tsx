import { type ComponentProps, type ReactNode, useContext, useEffect, useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { stagger, rise, viewportOnce } from '../anim'
import { TextScramble } from './text-scramble'
import { SplashReady } from '../splash'

// live clock in Ireland's timezone (HH:MM, 24h)
function irishTime() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Dublin',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}
function IrishTime() {
  const [time, setTime] = useState(irishTime)
  useEffect(() => {
    const id = setInterval(() => setTime(irishTime()), 15000)
    return () => clearInterval(id)
  }, [])
  return <span className="contact__time">{time}</span>
}

/* red guideline grid */
export function Guides() {
  return (
    <div className="guides" aria-hidden="true">
      <span className="guide guide--left" />
      <span className="guide guide--center" />
      <span className="guide guide--right" />
    </div>
  )
}

/* nav band framed by two red lines */
export function NavBand({ active }: { active?: 'home' | 'works' | 'contact' }) {
  const cls = (k: string) => (active === k ? 'is-active' : undefined)
  return (
    <div className="navband">
      <motion.nav className="nav" variants={stagger(0.08)} initial="hidden" animate="show">
        <motion.a href="#/" className="nav__logo" aria-label="Gavan Duffy — home" variants={rise(16)}>
          G · D
        </motion.a>
        <motion.a href="#works" className={cls('works')} variants={rise(16)}>WORKS</motion.a>
        <motion.a href="#contact" className={cls('contact')} variants={rise(16)}>CONTACT</motion.a>
      </motion.nav>
    </div>
  )
}

/* per-word reveal: each word fades + rises, staggered */
export function Words({ text }: { text: string }) {
  return (
    <motion.span className="words" variants={stagger(0.045)} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <motion.span className="words__word" variants={rise(20)} key={i} aria-hidden="true">
          {w}
        </motion.span>
      ))}
    </motion.span>
  )
}

type RuleProps = {
  label: string
  align?: 'left' | 'right' | 'center' | 'center-right'
  id?: string
  band?: boolean // framed by a line above AND below (e.g. Selected Works)
}
export function Rule({ label, align = 'left', id, band }: RuleProps) {
  return (
    <motion.div className={`rule rule--${align}${band ? ' rule--band' : ''}`} id={id} variants={rise(20)}>
      <span className="tag">{label}</span>
    </motion.div>
  )
}

/* section that staggers its children into view once on scroll, gated on splash completion */
type SectionProps = ComponentProps<typeof motion.section>
export function RevealSection({ children, ...rest }: SectionProps) {
  const ready = useContext(SplashReady)
  return (
    <motion.section
      variants={stagger()}
      initial="hidden"
      animate={ready ? undefined : 'hidden'}
      whileInView={ready ? 'show' : undefined}
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </motion.section>
  )
}

export function ContactSection() {
  return (
    <RevealSection id="contact" className="contact">
      <div className="contact__panel">
        <div className="contact__top">
          <div className="contact__title-row">
            <img className="contact__peace" src="/icons/peace.svg" alt="" />
            <TextScramble as="h2" className="contact__title">CONNECT</TextScramble>
          </div>
          <p className="contact__tagline">
            I like interesting problems. If you've got one, let's talk.
          </p>
        </div>

        <div className="contact__bottom">
          <div className="contact__links">
            <a
              className="contact__link"
              href="https://ie.linkedin.com/in/gavan-duffy"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact__link-label">LinkedIn</span>
              <img className="contact__arrow" src="/arrow.svg" alt="" />
              <span className="contact__link-val">in/gavan-duffy</span>
            </a>
            <a className="contact__link" href="mailto:duffyarch@gmail.com">
              <span className="contact__link-label">Mail</span>
              <img className="contact__arrow" src="/arrow.svg" alt="" />
              <span className="contact__link-val">duffyarch@gmail.com</span>
            </a>
          </div>

          <div className="contact__clock">
            <span className="hero__irl-text">Ireland</span>
            <IrishTime />
          </div>
        </div>
      </div>
    </RevealSection>
  )
}

export function Credit() {
  return (
    <footer className="credit">
      <span>© {new Date().getFullYear()} Gavan Duffy</span>
      <span>Senior Product Designer — Based in Ireland</span>
    </footer>
  )
}

/* inline icon placeholder — swap for an animated component later */
export function GlyphSlot() {
  return <span className="glyph-slot" aria-hidden="true" />
}

/* shared page chrome: content + full-bleed contact (no top nav) */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="shell">
        {children}
        <ContactSection />
      </div>
    </MotionConfig>
  )
}
