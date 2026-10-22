import { projects, type Block, type Project } from '../projects'

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

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>
    case 'list':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <div className="hm-callout">
          <p>{block.title}</p>
          {block.items.length > 0 && (
            <ul>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
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

export function CaseContent({ project, index, onNext }: CaseContentProps) {
  const next = projects[(index + 1) % projects.length]

  return (
    <>
      <header className="hm-rise hm-r1 hm-case__head">
        <div className="hm-case__kicker">
          <span>{kicker(project, index)}</span>
          <span>{project.year}</span>
        </div>
        <h2 className="hm-case__title">{project.headline}</h2>
        <p className="hm-case__sub">{project.intro}</p>
      </header>

      <dl className="hm-rise hm-r2 hm-meta">
        {project.meta.map((m) => (
          <div key={m.k}>
            <dt>{m.k}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>

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

      {project.sections.map((s) => (
        <section key={s.n} className="hm-rise hm-r5 hm-section">
          <h3>{index === 0 ? s.title : `${s.n} — ${s.title}`}</h3>
          <div className="hm-section__body">
            {s.blocks.map((b, i) => (
              <BlockView key={i} block={b} />
            ))}
          </div>
        </section>
      ))}

      {project.quote && (
        <blockquote className="hm-quote">
          <p>{project.quote}</p>
          <footer>{project.quoteBy}</footer>
        </blockquote>
      )}

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
    </>
  )
}
