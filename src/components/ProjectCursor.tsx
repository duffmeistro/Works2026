import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const W = 112
const H = 40
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const TARGET = 'VIEW'

function useScramble(trigger: boolean) {
  const [text, setText] = useState(TARGET)
  const prev = useRef(false)

  useEffect(() => {
    const rising = trigger && !prev.current
    prev.current = trigger
    if (!rising) return

    let frame = 0
    const total = 14
    const id = setInterval(() => {
      if (frame >= total) {
        setText(TARGET)
        clearInterval(id)
        return
      }
      const progress = frame / total
      setText(
        TARGET.split('').map((ch) =>
          Math.random() < progress ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('')
      )
      frame++
    }, 36)

    return () => clearInterval(id)
  }, [trigger])

  return text
}

export function ProjectCursor() {
  const [active, setActive] = useState(false)
  const label = useScramble(active)

  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const follow = { stiffness: 550, damping: 38, mass: 0.55 }
  const sx = useSpring(x, follow)
  const sy = useSpring(y, follow)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - W / 2)
      y.set(e.clientY - H / 2)
      const over = (e.target as Element | null)?.closest?.('[data-cursor-view]')
      setActive(Boolean(over))
    }
    const onLeave = () => setActive(false)
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y])

  return (
    <motion.div
      className="view-cursor"
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      initial={false}
      animate={{ scale: active ? 1 : 0.3, opacity: active ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.5 }}
    >
      <span>{label}</span>
      <img className="view-cursor__arrow" src="/icons/eye.svg" alt="" />
    </motion.div>
  )
}
