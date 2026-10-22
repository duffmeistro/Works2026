import { useEffect, useState } from 'react'
import { useMediaQuery, useReducedMotion } from '../hooks'
import type { Carousel } from '../projects'

const INTERVAL_MS = 3200
const STAGGER_S = 0.03

type PhoneCarouselProps = {
  carousel: Carousel
  running: boolean
  className: string
}

export function PhoneCarousel({ carousel, running, className }: PhoneCarouselProps) {
  const count = carousel.screens.length
  const slots = count * 2
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reduceMotion = useReducedMotion()
  const pitch = isMobile ? 159 : 276
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!running || reduceMotion) return
    const id = window.setInterval(() => {
      if (!document.hidden) setStep((n) => n + 1)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [running, reduceMotion])

  return (
    <figure className={`hm-phones hm-phones--hero hm-phones--carousel ${className}`} aria-label={carousel.label}>
      {Array.from({ length: slots }, (_, j) => {
        let d = (((j - step) % slots) + slots) % slots
        if (d > count) d -= slots
        const screen = carousel.screens[j % count]
        return (
          <div
            key={j}
            className={d === count ? 'hm-car-slot is-jump' : 'hm-car-slot'}
            style={{
              transform: `translateX(${d * pitch}px)`,
              transitionDelay: `${(Math.max(0, Math.min(4, d + 2)) * STAGGER_S).toFixed(2)}s`,
            }}
            aria-hidden={d !== 0}
          >
            <div className="hm-phone hm-phone--flat hm-car-phone">
              <div className="hm-phone__screen">
                <img
                  className="hm-screen__img"
                  src={screen.src}
                  alt={j < count ? screen.alt : ''}
                  width={screen.width}
                  height={screen.height}
                  loading="lazy"
                  decoding="async"
                />
                <span className="hm-phone__island" />
              </div>
            </div>
          </div>
        )
      })}
    </figure>
  )
}
