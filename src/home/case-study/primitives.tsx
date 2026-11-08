import { useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks'
import { PanelOpenContext } from '../components/Media'

export const asset = (name: string) => `/case-study/${name}`

export function useLive<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const open = useContext(PanelOpenContext)
  const reduceMotion = useReducedMotion()
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, open && inView && !reduceMotion] as const
}

export function Part({ label, children }: { label: string; children: ReactNode }) {
  return (
    <article className="cs-part" aria-label={label}>
      {children}
    </article>
  )
}

export function Tag({ tone = 'cream', children }: { tone?: 'cream' | 'teal'; children: ReactNode }) {
  return <span className={tone === 'teal' ? 'cs-tag cs-tag--teal' : 'cs-tag'}>{children}</span>
}

export function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="cs-sec">
      <h3 className="cs-h3">{title}</h3>
      <div className="cs-body">{children}</div>
    </section>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="cs-label">{children}</p>
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="cs-list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="cs-callout">
      <p>{children}</p>
    </div>
  )
}

export function Quote({ text, by }: { text: ReactNode; by: ReactNode }) {
  return (
    <blockquote className="cs-quote">
      <p>{text}</p>
      <footer>{by}</footer>
    </blockquote>
  )
}

type FigureProps = { className?: string; style?: CSSProperties; children: ReactNode }

export function Figure({ className, style, children }: FigureProps) {
  return (
    <figure className={className ? `cs-fig ${className}` : 'cs-fig'} style={style}>
      {children}
    </figure>
  )
}

type ImgProps = { name: string; alt: string; width: number; height: number; className?: string }

export function Img({ name, alt, width, height, className }: ImgProps) {
  return (
    <img
      className={className ? `cs-img ${className}` : 'cs-img'}
      src={asset(name)}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
    />
  )
}

export function Block({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="cs-block">
      <Tag>{label}</Tag>
      {children}
    </div>
  )
}
