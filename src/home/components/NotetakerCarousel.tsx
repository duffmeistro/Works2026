import { useEffect, useState } from 'react'
import { Screen } from './Stage'
import type { Project } from '../projects'

const COUNT = 5
const SLOTS = COUNT * 2
const PITCH = 336
const INTERVAL_MS = 3200

type NotetakerCarouselProps = {
  project: Project
  running: boolean
}

export function NotetakerCarousel({ project, running }: NotetakerCarouselProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      if (!document.hidden) setStep((n) => n + 1)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [running])

  return (
    <figure
      className="hm-hero hm-hero--carousel hm-rise hm-r3"
      aria-label="Notetaker screens carousel"
      style={{ backgroundColor: project.bg }}
    >
      {Array.from({ length: SLOTS }, (_, j) => {
        let d = (((j - step) % SLOTS) + SLOTS) % SLOTS
        if (d > COUNT) d -= SLOTS
        const k = j % COUNT
        const src = project.screens[k]
        return (
          <div
            key={j}
            className={d === COUNT ? 'hm-car-slot is-jump' : 'hm-car-slot'}
            style={{
              transform: `translateX(${d * PITCH}px)`,
              transitionDelay: `${Math.max(0, Math.min(4, d + 2)) * 0.03}s`,
            }}
            aria-hidden={d !== 0}
          >
            <div className="hm-phone hm-phone--flat">
              <div className="hm-phone__screen">
                <Screen
                  src={src}
                  alt={k === 0 ? 'Voice assistant ready to chat' : 'Voice assistant answering a question about the last deal created'}
                  project={project}
                  side="l"
                  label={`screen 0${k + 1}`}
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
