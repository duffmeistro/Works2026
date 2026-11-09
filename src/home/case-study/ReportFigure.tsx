import { useElementWidth } from '../hooks'
import { BreezeReport } from './BreezeReport'
import { Figure, useLive } from './primitives'
import styles from './Part1Hero.module.css'

const MAX_SCALE = 0.72

export function ReportFigure() {
  const [ref, width] = useElementWidth<HTMLDivElement>(1120)
  const [liveRef, live] = useLive<HTMLDivElement>()
  const wide = width >= 728
  const scale = wide ? MAX_SCALE : Math.max(0.3, Math.min(MAX_SCALE, (width - 64) / 390))
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
