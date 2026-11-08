import { useEffect, useState } from 'react'
import { Device } from './Device'
import { asset, useLive } from './primitives'
import s from './PhoneCarousel.module.css'

export type Shot = { name: string; alt: string; width: number; height: number }

type PhoneCarouselProps = {
  label: string
  shots: Shot[]
  reverse?: boolean
}

const SLOTS = [0, 1, 2, 3, 4, 5, 6, 7]
const STEP = 276
const INTERVAL = 3200

function slotFor(j: number, tick: number, reverse: boolean) {
  let d = (((reverse ? j + tick : j - tick) % 8) + 8) % 8
  if (d > 4) d -= 8
  const jump = reverse ? d === -3 : d === 4
  const delay = Math.max(0, Math.min(4, reverse ? 2 - d : d + 2)) * 0.03
  return { x: d * STEP, jump, delay }
}

export function PhoneCarousel({ label, shots, reverse = false }: PhoneCarouselProps) {
  const [ref, live] = useLive<HTMLElement>()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => setTick((t) => t + 1), INTERVAL)
    return () => window.clearInterval(id)
  }, [live])

  return (
    <figure ref={ref} className={`cs-fig ${s.figure}`} aria-label={label}>
      <div className={s.stage}>
        {SLOTS.map((j) => {
          const { x, jump, delay } = slotFor(j, tick, reverse)
          const shot = shots[j % shots.length]
          const first = j < shots.length
          return (
            <div
              key={j}
              className={jump ? `${s.slot} ${s.jump}` : s.slot}
              style={{ transform: `translateX(${x}px)`, transitionDelay: `${delay}s` }}
              aria-hidden={first ? undefined : true}
            >
              <Device island>
                <img className={s.shot} src={asset(shot.name)} alt={first ? shot.alt : ''} width={shot.width} height={shot.height} decoding="async" />
              </Device>
            </div>
          )
        })}
      </div>
    </figure>
  )
}
