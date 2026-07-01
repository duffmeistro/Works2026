import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion'
import App from './App'
import ProjectPage from './ProjectPage'
import { ProjectCursor } from './components/ProjectCursor'
import { ScrollLogo } from './components/ScrollLogo'
import { Menu } from './components/Menu'
import { Splash } from './components/Splash'
import { SplashReady } from './splash'

function currentHash() {
  return window.location.hash
}

// prevent browser from restoring scroll position on load/back-forward
if (typeof window !== 'undefined') {
  history.scrollRestoration = 'manual'
}

const EASE = [0.76, 0, 0.24, 1] as const


export default function Router() {
  const [hash, setHash] = useState(currentHash)
  const [ready, setReady] = useState(false)
  const [covering, setCovering] = useState(false)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.2, easing: (t) => 1 - Math.pow(1 - t, 3) })
    lenisRef.current = lenis
    lenis.scrollTo(0, { immediate: true })
    // second pass: catch any post-mount browser hash scroll
    const raf = requestAnimationFrame(() => lenis.scrollTo(0, { immediate: true }))
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null }
  }, [])

  useAnimationFrame((time) => {
    lenisRef.current?.raf(time)
  })

  useEffect(() => {
    const onChange = () => {
      const nextHash = currentHash()
      const leaving = /^#\/project\//.test(hash) || /^#\/project\//.test(nextHash)

      if (leaving) {
        setCovering(true)
        setTimeout(() => {
          setHash(nextHash)
          lenisRef.current?.scrollTo(0, { immediate: true })
        }, 320)
        setTimeout(() => setCovering(false), 400)
      } else {
        setHash(nextHash)
        lenisRef.current?.scrollTo(0, { immediate: true })
      }
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [hash])

  const match = hash.match(/^#\/project\/(.+)$/)

  return (
    <SplashReady.Provider value={ready}>
      {match ? <ProjectPage slug={match[1]} /> : <App />}
      <Menu />
      {match ? (
        <a
          className="proj-back"
          href="#works"
          style={{ position: 'fixed', top: 'var(--header-top)', left: 'var(--edge)', zIndex: 1000 }}
        >
          <img className="proj-back__arrow" src="/arrow.svg" alt="" />
          BACK
        </a>
      ) : (
        <ScrollLogo />
      )}
      <ProjectCursor />
      <Splash onDone={() => setReady(true)} />

      <AnimatePresence>
        {covering && (
          <motion.div
            key="page-transition"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
              background: '#1825aa',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </SplashReady.Provider>
  )
}
