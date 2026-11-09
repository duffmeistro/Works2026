import { useElementWidth } from '../hooks'
import { ChartCycle } from './ChartCycle'
import { Block, Part, Section } from './primitives'
import s from './Part5Next.module.css'

const PROTO_W = 390
const PROTO_H = 1240
const MAX_SCALE = 0.72

export function Part5Next() {
  const [boxRef, boxWidth] = useElementWidth<HTMLDivElement>(312)
  const scale = Math.min(MAX_SCALE, boxWidth / PROTO_W)

  return (
    <Part label="Case study: Coming next">
      <Section title="Coming next">
        <p>
          Once the foundation was set, HubSpot and Mobile are now expanding Breeze AI to introduce new features like <b>dynamic artifacts</b> and a list of more
          improvements for our customers.
          <br />
          <br />
          Check out 3 examples of the inline dynamic content artifacts we have in development currently below.
        </p>
      </Section>

      <Block label="Dynamic artifacts (3 looks)">
        <figure
          className={`cs-fig ${s.fig}`}
          aria-label="Breeze Assistant dark mode cycling through three dynamic artifacts: stacked bars, a gauge and split bars"
        >
          <div ref={boxRef} className={s.box}>
            <div className={s.frame} style={{ width: PROTO_W * scale, height: PROTO_H * scale, borderRadius: 44 * scale }}>
              <div className={s.screen} style={{ transform: `scale(${scale})` }}>
                <ChartCycle />
              </div>
            </div>
          </div>
        </figure>
      </Block>
    </Part>
  )
}
