import { useElementWidth } from '../hooks'
import { BreezeFlow } from './BreezeFlow'
import s from './Part9Impact.module.css'

const PHONE_W = 308
const PHONE_H = 648

export function FlowFigure() {
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
