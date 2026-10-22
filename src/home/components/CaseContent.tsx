import type { CSSProperties } from 'react'
import { useReducedMotion } from '../hooks'
import { NotetakerCarousel } from './NotetakerCarousel'
import { projects, type Project } from '../projects'

type CaseContentProps = {
  project: Project
  index: number
  open: boolean
  onNext: () => void
}

function kicker(project: Project, index: number) {
  if (index === 0) return 'About'
  return `Case study 0${index} / 0${projects.length - 1} · ${project.name}`
}

function Placeholder({ project, caption, variant }: { project: Project; caption: string; variant: 'hero' | 'figure' }) {
  return (
    <figure className={`hm-fig hm-fig--${variant}`} style={{ backgroundColor: project.bg, '--accent': project.accent } as CSSProperties}>
      {variant === 'hero' && <div className="hm-fig__pill" aria-hidden="true" />}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function Hero({ project, open }: { project: Project; open: boolean }) {
  const reduceMotion = useReducedMotion()
  if (project.slug === 'notetaker') {
    return (
      <>
        <NotetakerCarousel project={project} running={open && !reduceMotion} />
        <div className="hm-hero hm-hero--static hm-rise hm-r3" style={{ backgroundColor: project.bg }}>
          {project.screens.map((src, i) => (
            <div key={src} className="hm-phone hm-phone--flat">
              <div className="hm-phone__screen">
                <img className="hm-screen__img" src={src} alt={i === 0 ? 'Voice assistant ready to chat' : 'Voice assistant answering a question about the last deal created'} />
                <span className="hm-phone__island" />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }
  return (
    <div className="hm-rise hm-r3">
      <Placeholder project={project} caption="[Hero image — the key screen or flow]" variant="hero" />
    </div>
  )
}

export function CaseContent({ project, index, open, onNext }: CaseContentProps) {
  const isProject = index !== 0
  const next = projects[(index + 1) % projects.length]

  return (
    <>
      <header className="hm-rise hm-r1 hm-case__head">
        <div className="hm-case__kicker">
          <span>{kicker(project, index)}</span>
          <span>{project.year}</span>
        </div>
        <h2 className="hm-case__title">{project.headline}</h2>
        <p className="hm-case__sub">{project.sub}</p>
      </header>

      {project.meta.length > 0 && (
        <dl className="hm-rise hm-r2 hm-meta">
          {project.meta.map((m) => (
            <div key={m.k}>
              <dt>{m.k}</dt>
              <dd>{m.v}</dd>
            </div>
          ))}
        </dl>
      )}

      {isProject && <Hero project={project} open={open} />}

      {project.metrics.length > 0 && (
        <section className="hm-rise hm-r4 hm-metrics">
          {project.metrics.map((m) => (
            <div key={m.v} className="hm-metric">
              <div className="hm-metric__v">{m.v}</div>
              <div className="hm-metric__l">{m.l}</div>
            </div>
          ))}
        </section>
      )}

      {project.sections.map((s) => (
        <section key={s.n} className="hm-rise hm-r5 hm-section">
          <h3>
            {s.n} — {s.t}
          </h3>
          <div className="hm-section__body">
            {s.paras.map((p, i) => (
              <p key={i}>{p.t}</p>
            ))}
          </div>
        </section>
      ))}

      {isProject && (
        <div className="hm-figs">
          <Placeholder project={project} caption="[Process — sketches, flows]" variant="figure" />
          <Placeholder project={project} caption="[Final screens]" variant="figure" />
        </div>
      )}

      {project.quote && (
        <blockquote className="hm-quote">
          <p>{project.quote}</p>
          <footer>{project.quoteBy}</footer>
        </blockquote>
      )}

      <div className="hm-next">
        <span>Next project</span>
        <button type="button" className="hm-nextbtn" onClick={onNext}>
          {next.name}
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 9 H16 M10 3 L16 9 L10 15" />
          </svg>
        </button>
      </div>
    </>
  )
}
