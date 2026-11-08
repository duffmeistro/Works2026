import { useElementWidth } from '../hooks'
import { Device } from './Device'
import { asset, Callout, Part, Section, Tag, useLive } from './primitives'
import s from './Part4Iterative.module.css'

type Shot = { name: string; alt: string; width: number; height: number }

type PhoneProps = {
  shot: Shot
  top?: boolean
  progress?: boolean
}

const FRAME_WIDTH = 548
const INSET = 48

function ShotImg({ shot }: { shot: Shot }) {
  return <img className={s.shot} src={asset(shot.name)} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
}

function LiveShot({ shot }: { shot: Shot }) {
  const [ref, live] = useLive<HTMLDivElement>()
  return (
    <div ref={ref} className={live ? s.live : `${s.live} ${s.paused}`}>
      <ShotImg shot={shot} />
      <div className={s.track} aria-hidden="true">
        <div className={s.fill} />
      </div>
    </div>
  )
}

function Phone({ shot, top = false, progress = false }: PhoneProps) {
  const [ref, width] = useElementWidth<HTMLElement>(FRAME_WIDTH)
  const k = width / FRAME_WIDTH
  const offset = INSET * k
  return (
    <figure ref={ref} className={`cs-fig ${s.figure}`}>
      <div
        className={top ? `${s.phone} ${s.top}` : s.phone}
        style={{ [top ? 'top' : 'bottom']: `${offset}px`, transform: k === 1 ? undefined : `scale(${k})` }}
      >
        <Device size="lg">{progress ? <LiveShot shot={shot} /> : <ShotImg shot={shot} />}</Device>
      </div>
    </figure>
  )
}

type PairSide = { tag: string; shot: Shot; progress?: boolean }

function Pair({ top = false, before, after }: { top?: boolean; before: PairSide; after: PairSide }) {
  return (
    <div className={s.pair}>
      <div className={s.col}>
        <Tag>{before.tag}</Tag>
        <Phone shot={before.shot} top={top} progress={before.progress} />
      </div>
      <div className={s.col}>
        <Tag tone="teal">{after.tag}</Tag>
        <Phone shot={after.shot} top={top} progress={after.progress} />
      </div>
    </div>
  )
}

export function Part4Iterative() {
  return (
    <Part label="Case study: Iterative approach">
      <Section title="ITERATIVE APPROACH">
        <p>
          Throughout the process of building up Breeze on mobile, we definitely leaned into launching and testing early with real customer data on
          their portals. By doing this, we were able to use data and not rely on longer cycles of qualitative validation.{' '}
        </p>
        <Callout>
          With a mix of both quantitative and qualitative feedback, we went through many iterations of more granular improvements. All of these gave
          customers better thread results, better system visibility, supporting reps in building new ways of working for this AI era.
        </Callout>
        <p>
          {' '}Eventually things like our integrated agents and more dynamic content in our Breeze AI chat are the result. You can see some before
          and after improvements below
        </p>
      </Section>

      <Pair
        top
        before={{
          tag: 'EARLY CHAT THREAD',
          shot: {
            name: 'simple-thread.png',
            alt: 'Simple thread: Breeze answers Tell me about my most recently created deal with a plain text reply about Umbrella Inc',
            width: 750,
            height: 1620,
          },
        }}
        after={{
          tag: 'RICHER UI',
          shot: {
            name: 'richer-ui-the-same-answer-with-an.png',
            alt: 'Richer UI: the same answer with an Umbrella Inc deal card, an inline record chip and the key date and value in bold',
            width: 750,
            height: 1620,
          },
        }}
      />

      <Pair
        before={{
          tag: 'EARLY NOTIFICATIONS',
          shot: {
            name: 'before-a-standard-lock-screen-notification-breeze.png',
            alt: 'Before: a standard lock screen notification, Breeze research is ready, Your research report for Deal progression last 90 days is ready',
            width: 750,
            height: 1624,
          },
        }}
        after={{
          tag: 'RICH LIVE ACTIVITY',
          progress: true,
          shot: {
            name: 'after-a-live-activity-on-the-lock.png',
            alt: 'After: a Live Activity on the lock screen, Breeze deep research, Your task is running for Deal progression last 90 days, with a progress bar',
            width: 750,
            height: 1620,
          },
        }}
      />

      <Pair
        top
        before={{
          tag: 'EARLY PROSPECTING',
          shot: {
            name: 'job-thread-asking-which-contacts-are-the.png',
            alt: 'Job thread: asking which contacts are the warmest leads this month, with a plain text reply naming Umbrella Inc, ElloPak and Dynomatics',
            width: 750,
            height: 1620,
          },
        }}
        after={{
          tag: 'CUSTOM AGENT UI',
          shot: {
            name: 'custom-agent-ui.png',
            alt: 'Custom agent UI: the same request sent to the Prospecting agent, returning lead cards for Umbrella Inc, ElloPak and Dynomatics with Hot and Warm tags',
            width: 750,
            height: 1620,
          },
        }}
      />
    </Part>
  )
}
