import { useElementWidth } from '../hooks'
import { BreezeReport } from './BreezeReport'
import { CrmComposition } from './CrmComposition'
import { Block, Callout, Figure, Part, Section, Tag, useLive } from './primitives'
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

function HeroPrototypes() {
  const [ref, width] = useElementWidth<HTMLDivElement>(1120)
  const [liveRef, live] = useLive<HTMLDivElement>()
  const wide = width >= 728
  const scale = wide ? 0.8 : Math.max(0.3, Math.min(0.8, (width - 64) / 390))
  return (
    <Figure className={wide ? styles.heroFig : undefined}>
      <div ref={liveRef} className={styles.fill}>
        <div
          ref={ref}
          className={wide ? styles.phones : `${styles.phones} ${styles.phonesStack}`}
          role="img"
          aria-label="Breeze Assistant chat report prototype, light and dark mode"
        >
          {(['light', 'dark'] as const).map((theme) => (
            <div key={theme} className={styles.phone} style={{ width: 390 * scale, height: 1154 * scale, borderRadius: 44 * scale }}>
              <div className={styles.phoneInner} style={{ transform: `scale(${scale})` }}>
                <BreezeReport theme={theme} live={live} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Figure>
  )
}

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

      <Block label="Breeze AI and voice on HubSpot mobile">
        <HeroPrototypes />
      </Block>

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
