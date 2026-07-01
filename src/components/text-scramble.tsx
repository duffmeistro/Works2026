import { type JSX, type ElementType, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, type MotionProps } from 'framer-motion'

type TextScrambleProps = {
  children: string
  duration?: number
  speed?: number
  characterSet?: string
  as?: ElementType
  className?: string
  /** explicit control; when omitted the effect runs once on scroll-into-view */
  trigger?: boolean
  onScrambleComplete?: () => void
} & MotionProps

const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function scrambleAll(text: string, chars: string) {
  let out = ''
  for (const c of text) {
    out += c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

export function TextScramble({
  children,
  duration = 0.9,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  // memoize so re-renders during the scramble don't remount the element (kills the ref)
  const MotionComponent = useMemo(
    () => motion.create(Component as keyof JSX.IntrinsicElements),
    [Component],
  ) as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  // start fully scrambled so the real word never flashes before the effect plays
  const [displayText, setDisplayText] = useState(() => scrambleAll(children, characterSet))
  const animating = useRef(false)
  const done = useRef(false)

  const scramble = () => {
    if (animating.current || done.current) return
    animating.current = true
    const steps = duration / speed
    let step = 0
    const interval = setInterval(() => {
      let out = ''
      const progress = step / steps
      for (let i = 0; i < children.length; i++) {
        if (children[i] === ' ') {
          out += ' '
          continue
        }
        out +=
          progress * children.length > i
            ? children[i]
            : characterSet[Math.floor(Math.random() * characterSet.length)]
      }
      setDisplayText(out)
      step++
      if (step > steps) {
        clearInterval(interval)
        setDisplayText(children)
        animating.current = false
        done.current = true
        onScrambleComplete?.()
      }
    }, speed * 1000)
  }

  useEffect(() => {
    const shouldRun = trigger ?? inView
    if (shouldRun) scramble()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, inView])

  return (
    <MotionComponent ref={ref} className={className} {...props}>
      {displayText}
    </MotionComponent>
  )
}
