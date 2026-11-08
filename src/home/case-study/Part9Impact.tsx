import { useElementWidth } from '../hooks'
import { BreezeFlow } from './BreezeFlow'
import { DemoVideo } from './DemoVideo'
import { Part, Quote, Section, Tag } from './primitives'
import s from './Part9Impact.module.css'

const PHONE_W = 308
const PHONE_H = 648

const STATS = [
  { n: '8.1k', c: 'Voice AI MAUs, about 15% of Breeze AI users (Nov 2026)' },
  { n: '52.3k', c: 'Breeze AI MAUs, of 302k total Breeze app users (Nov 2026)' },
  { n: '+51%', c: 'Month on month growth in Breeze AI visits (since Aug 2026)' },
  {
    n: '~4k',
    c: (
      <>
        Daily active Breeze users on voice
        <br />
        (Oct 2026)
      </>
    ),
  },
  { n: '+65%', c: 'Latency improvement since the first beta (Oct 2026)' },
  { n: '18%', c: 'Of users prompt through speech to text (Oct 2026)' },
]

function FlowFigure() {
  const [ref, width] = useElementWidth<HTMLElement>(1120)
  const scale = Math.min(1, (width - 64) / PHONE_W)
  return (
    <figure
      ref={ref}
      className={s.flowFig}
      role="img"
      aria-label="Breeze prototype: from Home, open Breeze, ask about the Campaign Pipeline and get a chart report"
    >
      <div className={s.phoneBox} style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
        <div className={s.phone} style={{ transform: `scale(${scale})` }}>
          <div className={s.screen}>
            <div className={s.flowScale}>
              <BreezeFlow />
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}

export function Part9Impact() {
  return (
    <Part label="Case study: Impact">
      <Section title="Impact">
        <p>
          <strong className={s.strong}>What has shipped:</strong>&nbsp;
        </p>
        <p>
          Breeze AI on mobile has been in customers’ hands for just over a year now. It’s becoming an integral part of a lot of our reps’ day-to-day
          interactions with HubSpot on the move.
          <br />
          <br />
          Breeze Voice has been in the wild since September 2026 and is growing month to month.
          <br />
          <br />
          With both of these products they are early in their adoption graphs but customers are beginning to see the power and speed of our AI layer
          across their work to align and dive into a lot of their data across their HubSpot mobile CRM
        </p>
      </Section>

      <div className={s.media}>
        <div className="cs-block">
          <Tag tone="teal">Breeze voice live demo (sound on)</Tag>
          <DemoVideo />
        </div>
        <div className="cs-block">
          <Tag tone="teal">Breeze AI flow - generate artifact</Tag>
          <FlowFigure />
        </div>
      </div>

      <Quote
        text="Breeze is surprisingly very helpful and very versatile. It was refreshing and exciting to see the wide array of tasks that can be completed with Breeze via voice commands!"
        by="Frank, sales manager, USA"
      />

      <section className={s.stats} aria-label="Results">
        {STATS.map((stat) => (
          <div key={stat.n} className={s.stat}>
            <div className={s.num}>{stat.n}</div>
            <div className={s.cap}>{stat.c}</div>
          </div>
        ))}
      </section>
    </Part>
  )
}
