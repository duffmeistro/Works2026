import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TextScramble } from './text-scramble'

const ICON_STYLE: React.CSSProperties = {
  height: '0.75em',
  width: 'auto',
  display: 'inline-block',
  verticalAlign: 'middle',
  filter: 'brightness(0) invert(1)',
  margin: '0 0.2em',
  position: 'relative',
  top: '-0.05em',
}

export function Splash({ onDone }: { onDone: () => void }) {
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!gone && (
        <motion.div
          className="splash"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="splash__logo">
            <span className="splash__word splash__word--gav">
              <TextScramble as="span" duration={1.4} speed={0.04}>GAV</TextScramble>
            </span>
            <img src="/icons/mountain.svg" alt="" style={ICON_STYLE} />
            <span className="splash__word splash__word--works">
              <TextScramble as="span" duration={1.4} speed={0.04}>WORKS</TextScramble>
            </span>
            <img src="/icons/lightbulb.svg" alt="" style={ICON_STYLE} />
            <span className="splash__word splash__word--year">
              <TextScramble as="span" duration={1.4} speed={0.04}>2026</TextScramble>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
