import { useElementWidth } from '../hooks'
import { CrmComposition } from './CrmComposition'
import { FlowFigure } from './FlowFigure'
import { Block, Callout, Figure, Part, Section, Tag } from './primitives'
import { Stats } from './Stats'
import styles from './Part1Hero.module.css'

const DETAILS = [
  {
    term: 'Product',
    value: (
      <>
        Mobile CRM: <br />
        Breeze AI and Voice
      </>
    ),
  },
  { term: 'Company', value: 'HubSpot' },
  { term: 'Timeline', value: 'Jan 2026 – Present' },
  { term: 'Role', value: 'Senior Product Designer' },
]

function CrmFigure() {
  const [ref, width] = useElementWidth<HTMLDivElement>(1120)
  const crop = width < 728 ? { x: 180, y: 70, w: 1240, h: 850 } : { x: 0, y: 0, w: 1600, h: 983 }
  const scale = width / crop.w
  return (
    <div ref={ref}>
      <Figure style={{ height: crop.h * scale }}>
        <div
          className={styles.crm}
          role="img"
          aria-label="LLM view composed from mobile CRM screens"
          style={{ transform: `translate(${-crop.x * scale}px, ${-crop.y * scale}px) scale(${scale})` }}
        >
          <CrmComposition />
        </div>
      </Figure>
    </div>
  )
}

export function Part1Hero() {
  return (
    <Part label="Case study: Breeze AI and Voice">
      <header className={styles.header}>
        <div className={styles.kicker}>
          <span>HubSpot · Breeze AI and Voice</span>
          <span>2026</span>
        </div>
        <h2 className={styles.title}>Beyond the tap. Reimagining our mobile CRM with Breeze AI</h2>
        <p className={styles.intro}>
          How we evolved our traditional CRM interface using our native AI 'Breeze' to reimagine how reps on the road get work done.
        </p>
        <Tag tone="teal">CASE STUDY - NOV 2026</Tag>
      </header>

      <dl className={styles.meta}>
        {DETAILS.map((d) => (
          <div key={d.term}>
            <dt>{d.term}</dt>
            <dd>{d.value}</dd>
          </div>
        ))}
      </dl>

      <FlowFigure />

      <Stats />

      <Section title="THE WHY">
        <p>
          Over the last couple of years, HubSpot brought Breeze, its very own AI tool to the world. On mobile, that raised a new question: what should this
          new interaction modality work like on a phone that will help our sales reps in the field and on the move.
        </p>
        <Callout>
          The opportunity was clear. The AI retrieval layer could help sales reps on the road reduce their admin time, speed up their workflows, and gather
          data in a new paradigm. Not only by tapping through UI.
        </Callout>
      </Section>

      <Block label="AI as the retrieval layer opportunity">
        <CrmFigure />
      </Block>

      <Section title="Mobile sales reps">
        <Callout>
          Over 300k HubSpot users utilise our mobile CRM on the road. These are sales reps whose day-to-day is back-to-back meetings, travelling between
          client locations, and needing quick information from our app while they are on the move.
        </Callout>
        <p>
          For most of that day the phone is the only tool they have to check customer information, previous comms and deal information. But with every new
          release, we were starting to see some real friction between the amount of features and information our users needed to access, versus the time
          they had to hand. This was a clear surface where AI could help speed up what they could do.
        </p>
      </Section>
    </Part>
  )
}
