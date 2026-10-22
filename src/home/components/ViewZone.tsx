import { forwardRef, useState, type FocusEvent, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../projects'

const ARROW_PATH = 'M3 9 H15 M10 4 L15 9 L10 14'

function Arrow({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={ARROW_PATH} />
    </svg>
  )
}

export function viewLabel(index: number) {
  return index === 0 ? 'Learn more' : 'View project'
}

type ViewZoneProps = {
  project: Project
  index: number
}

export const ViewZone = forwardRef<HTMLAnchorElement, ViewZoneProps>(function ViewZone(
  { project, index },
  ref,
) {
  const [hover, setHover] = useState(false)
  const [snap, setSnap] = useState(true)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const track = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const label = index === 0 ? 'Learn more about Gavan Duffy' : `View project: ${project.homeName}`

  return (
    <Link
      ref={ref}
      to={`/work/${project.slug}`}
      className="hm-zone hm-hip"
      aria-label={label}
      onMouseEnter={(e) => {
        track(e)
        setSnap(true)
        setHover(true)
      }}
      onMouseMove={(e) => {
        track(e)
        setSnap(false)
        setHover(true)
      }}
      onMouseLeave={() => setHover(false)}
      onClick={() => setHover(false)}
      onFocus={(e: FocusEvent<HTMLAnchorElement>) => {
        setPos({ x: e.currentTarget.offsetWidth / 2, y: e.currentTarget.offsetHeight / 2 })
        setSnap(true)
        setHover(true)
      }}
      onBlur={() => setHover(false)}
    >
      <div
        className={snap ? 'hm-pillpos is-snap' : 'hm-pillpos'}
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
        aria-hidden="true"
      >
        <div className={hover ? 'hm-pill is-on' : 'hm-pill'}>
          {viewLabel(index)}
          <Arrow size={18} />
        </div>
      </div>
    </Link>
  )
})

export const ViewButton = forwardRef<HTMLAnchorElement, ViewZoneProps>(function ViewButton(
  { project, index },
  ref,
) {
  return (
    <Link ref={ref} to={`/work/${project.slug}`} className="hm-viewbtn hm-hip">
      {viewLabel(index)}
      <Arrow size={14} />
    </Link>
  )
})
