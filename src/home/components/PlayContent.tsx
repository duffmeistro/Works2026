import type { CSSProperties, ReactNode } from 'react'
import { useMediaQuery } from '../hooks'
import { ACCENTS, type Tile } from '../playground'
import ConcertTicket from './ConcertTicket'
import DayFlow from './DayFlow'
import HeartRate from './HeartRate'
import LeadMatch from './LeadMatch'
import PlanBuilder from './PlanBuilder'
import RevenueChart from './RevenueChart'
import VoiceAIMixer from './VoiceAIMixer'
import VoiceComposer from './VoiceComposer'
import VoiceComposerMobile from './VoiceComposerMobile'
import VoiceOrbScreen from './VoiceOrbScreen'
import VoiceRecorder from './VoiceRecorder'

const SHOW_EXTRA_FIGURES = false
const SHOW_SUBTEXT = false
const TICKET_SCREENS = [
  { key: 'face', unlock: 'face', theme: 'light' },
  { key: 'fingerprint', unlock: 'fingerprint', theme: 'light' },
  { key: 'dark', unlock: 'fingerprint', theme: 'dark' },
] as const

type ScaledPhoneProps = { scale: number; width?: number; height?: number; children: ReactNode }

function ScaledPhone({ scale, width = 390, height = 844, children }: ScaledPhoneProps) {
  return (
    <div style={{ width: width * scale, height: height * scale }}>
      <div style={{ width, transform: `scale(${scale})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
  )
}

export function PlayContent({ tile }: { tile: Tile }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const deviceScale = isMobile ? 0.62 : 0.8
  const style = { backgroundColor: 'var(--hm-page)', '--accent': ACCENTS[tile.colour] } as CSSProperties
  return (
    <>
      <header className="hm-rise hm-r1 hm-case__head">
        <div className="hm-case__kicker">
          <span>Playground · {tile.number}</span>
          <span>2026</span>
        </div>
        <h2 className="hm-case__title">{tile.title}</h2>
        {SHOW_SUBTEXT && <p className="hm-case__sub">[A short paragraph on what this experiment is, why you made it and what you learned.]</p>}
      </header>
      <div className="hm-rise hm-r3 hm-playfigs">
        {tile.kind === 'rec' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device" style={style}>
            <VoiceRecorder scale={deviceScale} />
          </figure>
        ) : tile.kind === 'hr' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device" style={style}>
            <HeartRate width={390 * deviceScale} />
          </figure>
        ) : tile.kind === 'rev' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device hm-fig--pair" style={style}>
            {(['light', 'dark'] as const).map((theme) => (
              <ScaledPhone key={theme} scale={deviceScale}>
                <RevenueChart theme={theme} />
              </ScaledPhone>
            ))}
          </figure>
        ) : tile.kind === 'mix' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device" style={style}>
            <ScaledPhone scale={deviceScale}>
              <VoiceAIMixer />
            </ScaledPhone>
          </figure>
        ) : tile.kind === 'vo' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device" style={style}>
            <ScaledPhone scale={deviceScale}>
              <div className="hm-orbphone">
                <VoiceOrbScreen />
              </div>
            </ScaledPhone>
          </figure>
        ) : tile.kind === 'lm' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device" style={style}>
            <div style={{ width: 390 * deviceScale }}>
              <LeadMatch />
            </div>
          </figure>
        ) : tile.kind === 'df' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device hm-fig--pair" style={style}>
            {(['dark', 'light'] as const).map((theme) => (
              <ScaledPhone key={theme} scale={deviceScale}>
                <DayFlow theme={theme} />
              </ScaledPhone>
            ))}
          </figure>
        ) : tile.kind === 'vcm' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device hm-fig--pair" style={style}>
            {(['dark', 'light'] as const).map((theme) => (
              <ScaledPhone key={theme} scale={deviceScale}>
                <div className={`hm-composerphone hm-composerphone--${theme}`}>
                  <VoiceComposerMobile theme={theme} />
                </div>
              </ScaledPhone>
            ))}
          </figure>
        ) : tile.kind === 'tk' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device hm-fig--pair" style={style}>
            {TICKET_SCREENS.map((screen) => (
              <ScaledPhone key={screen.key} scale={deviceScale} width={414} height={868}>
                <ConcertTicket unlock={screen.unlock} theme={screen.theme} />
              </ScaledPhone>
            ))}
          </figure>
        ) : tile.kind === 'pb' ? (
          <figure className="hm-fig hm-fig--hero hm-fig--device hm-fig--pair" style={style}>
            {(['dark', 'light'] as const).map((theme) => (
              <ScaledPhone key={theme} scale={deviceScale}>
                <PlanBuilder theme={theme} />
              </ScaledPhone>
            ))}
          </figure>
        ) : tile.kind === 'rv' ? (
          <>
            <figure className="hm-fig hm-fig--hero hm-fig--device" style={style}>
              <iframe
                className="hm-rvframe"
                src="/reverie/index.html?bare=1"
                title="reverie prototype"
                loading="lazy"
                style={{ width: 390 * deviceScale, height: 844 * deviceScale, borderRadius: 28 * deviceScale }}
              />
            </figure>
            {(['dark', 'light'] as const).map((theme) => (
              <figure key={theme} className="hm-fig hm-fig--strip">
                <img
                  src={`/reverie-images/overview-strip-${theme}.webp`}
                  alt={`All eight reverie screens in ${theme} mode: intro, journal library, voice entry, streaks, prompt library, settings, profile and monthly insights`}
                  width={7728}
                  height={2268}
                  loading="lazy"
                />
              </figure>
            ))}
          </>
        ) : tile.kind === 'vc' ? (
          <>
            <figure className="hm-fig hm-fig--hero hm-fig--composer" style={style}>
              <VoiceComposer theme="light" />
            </figure>
            <figure className="hm-fig hm-fig--hero hm-fig--composer hm-fig--dark">
              <VoiceComposer theme="dark" />
            </figure>
          </>
        ) : (
          <figure className="hm-fig hm-fig--hero" style={style}>
            <div className="hm-fig__pill" aria-hidden="true" />
            <figcaption>[Image 01]</figcaption>
          </figure>
        )}
        {SHOW_EXTRA_FIGURES && (
          <div className="hm-playfigs__pair">
            <figure className="hm-fig hm-fig--tall" style={style}>
              <figcaption>[Image 02]</figcaption>
            </figure>
            <figure className="hm-fig hm-fig--tall" style={style}>
              <figcaption>[Image 03]</figcaption>
            </figure>
          </div>
        )}
      </div>
    </>
  )
}
