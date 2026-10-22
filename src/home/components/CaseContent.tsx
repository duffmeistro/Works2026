import { Fragment } from 'react'
import { projects, type Block, type Project } from '../projects'
import { HeroBlock, MediaBlock, MediaGroup, PanelOpenContext } from './Media'

type CaseContentProps = {
  project: Project
  index: number
  open: boolean
  onNext: () => void
}

const OUTCOME = 'The outcome'

function kicker(project: Project, index: number) {
  if (index === 0) return 'About'
  return `Case study 0${index} / 0${projects.length - 1} · ${project.name}`
}

function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>
    case 'list':
      return <List items={block.items} />
    case 'callout':
      return (
        <div className="hm-callout">
          <p>{block.title}</p>
          {block.items.length > 0 && <List items={block.items} />}
        </div>
      )
    case 'quote':
      return (
        <blockquote className="hm-quote hm-quote--inline">
          <p>“{block.text}”</p>
          <footer>{block.by}</footer>
        </blockquote>
      )
  }
}

function ProjectQuote({ project }: { project: Project }) {
  return (
    <blockquote className="hm-quote">
      <p>{project.quote}</p>
      <footer>{project.quoteBy}</footer>
    </blockquote>
  )
}

export function CaseContent({ project, index, open, onNext }: CaseContentProps) {
  const next = projects[(index + 1) % projects.length]
  const hasOutcome = project.sections.some((s) => s.title === OUTCOME)

  return (
    <PanelOpenContext.Provider value={open}>
      <header className="hm-rise hm-r1 hm-case__head">
        <div className="hm-case__kicker">
          <span>{kicker(project, index)}</span>
          <span>{project.year}</span>
        </div>
        <h2 className="hm-case__title">{project.headline}</h2>
        <p className="hm-case__intro">{project.intro}</p>
      </header>

      <dl className="hm-rise hm-r2 hm-meta">
        {project.meta.map((m) => (
          <div key={m.k}>
            <dt>{m.k}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>

      {project.hero && <HeroBlock hero={project.hero} />}

      {project.metrics.length > 0 && (
        <section className="hm-rise hm-r4 hm-metrics">
          {project.metrics.map((m) => (
            <div key={m.value} className="hm-metric">
              <div className="hm-metric__v">{m.value}</div>
              <div className="hm-metric__l">{m.label}</div>
            </div>
          ))}
        </section>
      )}

      {project.afterMetrics && <MediaBlock media={project.afterMetrics} rise="hm-r4" />}

      {project.sections.map((s) => (
        <Fragment key={s.n}>
          <section className="hm-rise hm-r5 hm-section">
            <h3>{index === 0 ? s.title : `${s.n} — ${s.title}`}</h3>
            <div className="hm-section__body">
              {s.blocks.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </div>
          </section>
          {project.quote && s.title === OUTCOME && <ProjectQuote project={project} />}
          <MediaGroup items={s.after} />
        </Fragment>
      ))}

      <MediaGroup items={project.end} />

      {project.quote && !hasOutcome && <ProjectQuote project={project} />}

      {index !== 0 && (
        <div className="hm-next">
          <span>Next project</span>
          <button type="button" className="hm-nextbtn" onClick={onNext}>
            {next.name}
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 9 H16 M10 3 L16 9 L10 15" />
            </svg>
          </button>
        </div>
      )}
    </PanelOpenContext.Provider>
  )
}
