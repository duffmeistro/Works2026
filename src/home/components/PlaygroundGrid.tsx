import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useElementHeight, useReducedMotion } from '../hooks'
import { ACCENTS, TINTS, type Tile } from '../playground'
import ConcertTicket from './ConcertTicket'
import DayFlow from './DayFlow'
import HeartRate from './HeartRate'
import LeadMatch from './LeadMatch'
import PlanBuilder from './PlanBuilder'
import RevenueChart from './RevenueChart'
import VoiceAIMixer from './VoiceAIMixer'
import VoiceComposerMobile from './VoiceComposerMobile'
import VoiceOrb from './VoiceOrb'

const HEART_RING_TOP = 153
const REVENUE_VIEW = { x: -25, y: 118, size: 440 }
const REVENUE_LOOP_MS = 4000
const MIXER_VIEW = { x: 0, y: 360, size: 390 }
const MIXER_WAVES = [
  { mid: 55, amp: 30, period: 3.2, phase: 0 },
  { mid: 60, amp: 28, period: 4.1, phase: 2 },
  { mid: 45, amp: 32, period: 2.7, phase: 4 },
]

const REVERIE_RINGS = [
  ['o1', 'c1'],
  ['o2', 'c2'],
  ['o3', 'c3'],
  ['o4', 'c4'],
  ['o5', 'c5'],
  ['oh', 'ch'],
  ['ok1', 'k1'],
  ['ok2', 'k2'],
  ['ok3', 'k3'],
]

const LEAD_VIEW = { x: -40, y: 196, size: 470 }

const DAYFLOW_VIEW = { x: 0, y: 56, size: 390 }

const COMPOSER_VIEW = { x: 186, y: 660, size: 204 }
const COMPOSER_DEMO_TEXT = 'Draft follow-ups for every open deal and flag anything that needs my sign-off.'

const TICKET_VIEW = { x: -66, y: 373, size: 546 }

const PLAN_VIEW = { x: -50, y: -10, size: 490 }

const WAVE_BARS = Array.from({ length: 9 }, (_, i) => i)

function RecorderLoop({ playing }: { playing: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const run = playing && !reduceMotion

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (run) video.play().catch(() => {})
    else video.pause()
  }, [run])

  return (
    <video
      ref={videoRef}
      className="hm-gimg hm-gvid"
      src="/work/playground/voice-recorder-loop.mp4"
      poster="/work/playground/voice-recorder-poster.png"
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  )
}

function HeartRateTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const scale = size / 390

  return (
    <span ref={ref} className="hm-art-hr" aria-hidden="true" {...{ inert: '' }}>
      {size > 0 && (
        <span style={{ transform: `translateY(${-HEART_RING_TOP * scale}px)` }}>
          <HeartRate width={size} radius={0} initialBpm={56} pulse={playing && !reduceMotion} background="#111111" />
        </span>
      )}
    </span>
  )
}

function RevenueTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const [replay, setReplay] = useState(0)
  const scale = size / REVENUE_VIEW.size

  useEffect(() => {
    if (!playing || reduceMotion) return
    setReplay((r) => r + 1)
    const id = window.setInterval(() => setReplay((r) => r + 1), REVENUE_LOOP_MS)
    return () => window.clearInterval(id)
  }, [playing, reduceMotion])

  return (
    <span ref={ref} className="hm-art-rev" aria-hidden="true" {...{ inert: '' }}>
      {size > 0 && (
        <span style={{ transform: `scale(${scale}) translate(${-REVENUE_VIEW.x}px, ${-REVENUE_VIEW.y}px)` }}>
          <RevenueChart theme="dark" showIsland={false} replayKey={replay} />
        </span>
      )}
    </span>
  )
}

function MixerTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const [levels, setLevels] = useState<[number, number, number]>([62, 78, 40])
  const scale = size / MIXER_VIEW.size

  useEffect(() => {
    if (!playing || reduceMotion) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const [a, b, c] = MIXER_WAVES.map((w) => Math.round(w.mid + w.amp * Math.sin((t * 2 * Math.PI) / w.period + w.phase)))
      setLevels((prev) => (prev[0] === a && prev[1] === b && prev[2] === c ? prev : [a, b, c]))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, reduceMotion])

  return (
    <span ref={ref} className="hm-art-mix" aria-hidden="true" {...{ inert: '' }}>
      {size > 0 && (
        <span style={{ transform: `scale(${scale}) translate(${-MIXER_VIEW.x}px, ${-MIXER_VIEW.y}px)` }}>
          <VoiceAIMixer rounded={false} liveLevels={levels} />
        </span>
      )}
    </span>
  )
}

function OrbTile({ playing }: { playing: boolean }) {
  const reduceMotion = useReducedMotion()
  return (
    <span className="hm-art-vo" aria-hidden="true">
      <VoiceOrb paused={!playing || reduceMotion} />
    </span>
  )
}

function LeadTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const scale = size / LEAD_VIEW.size

  return (
    <span ref={ref} className="hm-art-lm" aria-hidden="true" {...{ inert: '' }}>
      {size > 0 && (
        <span style={{ transform: `scale(${scale}) translate(${-LEAD_VIEW.x}px, ${-LEAD_VIEW.y}px)` }}>
          <LeadMatch demo={playing && !reduceMotion} />
        </span>
      )}
    </span>
  )
}

function ComposerTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const scale = size / COMPOSER_VIEW.size

  return (
    <span ref={ref} className="hm-art-vcm" aria-hidden="true" {...{ inert: '' }}>
      {size > 0 && (
        <span style={{ transform: `scale(${scale}) translate(${-COMPOSER_VIEW.x}px, ${-COMPOSER_VIEW.y}px)` }}>
          <VoiceComposerMobile theme="light" transcript={COMPOSER_DEMO_TEXT} demo={playing && !reduceMotion} />
        </span>
      )}
    </span>
  )
}

function DayFlowTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const scale = size / DAYFLOW_VIEW.size

  return (
    <span ref={ref} className="hm-art-df" aria-hidden="true" {...{ inert: '' }}>
      {size > 0 && (
        <span style={{ transform: `scale(${scale}) translate(${-DAYFLOW_VIEW.x}px, ${-DAYFLOW_VIEW.y}px)` }}>
          <DayFlow theme="dark" hint={false} demo={playing && !reduceMotion} style={{ borderRadius: 0 }} />
        </span>
      )}
    </span>
  )
}

function TicketTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const scale = size / TICKET_VIEW.size

  return (
    <span ref={ref} className="hm-art-tk" aria-hidden="true" {...{ inert: '' }}>
      {size > 0 && (
        <span style={{ transform: `scale(${scale}) translate(${-TICKET_VIEW.x}px, ${-TICKET_VIEW.y}px)` }}>
          <ConcertTicket autoplay={playing && !reduceMotion} />
        </span>
      )}
    </span>
  )
}

function PlanTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const scale = size / PLAN_VIEW.size

  return (
    <span ref={ref} className="hm-art-pb" aria-hidden="true" {...{ inert: '' }}>
      {size > 0 && (
        <span style={{ transform: `scale(${scale}) translate(${-PLAN_VIEW.x}px, ${-PLAN_VIEW.y}px)` }}>
          <PlanBuilder demo={playing && !reduceMotion} />
        </span>
      )}
    </span>
  )
}

function ReverieTile({ playing }: { playing: boolean }) {
  const [ref, size] = useElementHeight<HTMLSpanElement>()
  const reduceMotion = useReducedMotion()
  const style = { '--s': `${Math.round(size * 0.9)}px`, '--ps': playing && !reduceMotion ? 'running' : 'paused' } as CSSProperties

  return (
    <span ref={ref} className="hm-art-rv" aria-hidden="true">
      {size > 0 && (
        <span className="hm-rv-mo" style={style}>
          <span className="hm-rv-in">
            {REVERIE_RINGS.map(([orb, ring]) => (
              <span key={ring} className={`hm-rv-orb rv-${orb}`}>
                <span className={`hm-rv-c rv-${ring}`} />
              </span>
            ))}
          </span>
        </span>
      )}
    </span>
  )
}

export function TileArt({ tile, playing }: { tile: Tile; playing: boolean }) {
  const ac = ACCENTS[tile.colour]
  const bg = TINTS[tile.colour]
  switch (tile.kind) {
    case 'v1':
      return <img className="hm-gimg" src="/work/home/voice-ai-phone-right.jpg" alt="Voice assistant conversation screen" />
    case 'v2':
      return <img className="hm-gimg" src="/work/home/voice-ai-phone-left.jpg" alt="Voice assistant ready to chat screen" />
    case 'rec':
      return <RecorderLoop playing={playing} />
    case 'hr':
      return <HeartRateTile playing={playing} />
    case 'rev':
      return <RevenueTile playing={playing} />
    case 'mix':
      return <MixerTile playing={playing} />
    case 'vo':
      return <OrbTile playing={playing} />
    case 'rv':
      return <ReverieTile playing={playing} />
    case 'lm':
      return <LeadTile playing={playing} />
    case 'vcm':
      return <ComposerTile playing={playing} />
    case 'df':
      return <DayFlowTile playing={playing} />
    case 'tk':
      return <TicketTile playing={playing} />
    case 'pb':
      return <PlanTile playing={playing} />
    case 'vc':
      return <img className="hm-gimg" src="/work/playground/voice-composer-tile.jpg" alt="Voice composer listening, with a glow along its bottom edge" />
    case 'orb':
      return (
        <span className="hm-art-orb">
          <span className="hm-art-sw" style={{ background: `conic-gradient(from 0deg, ${ac}, #FFFFFF 25%, ${ac} 50%, ${bg} 75%, ${ac})` }} />
          <span className="hm-art-gl" />
        </span>
      )
    case 'pill':
      return <span className="hm-art-pill" style={{ background: `linear-gradient(180deg, ${ac} 0%, ${ac} 50%, #FFFFFF 100%)` }} />
    case 'wave':
      return (
        <span className="hm-art-wave">
          {WAVE_BARS.map((i) => (
            <span key={i} className="hm-wb2" />
          ))}
        </span>
      )
    case 'grad':
      return (
        <span className="hm-art-grad" style={{ background: `linear-gradient(180deg, ${bg} 0%, ${ac} 48%, #0E0E0E 100%)` }}>
          <span className="hm-art-cap">No.0{tile.colour + 1}</span>
        </span>
      )
    case 'type':
      return (
        <span className="hm-art-type" style={{ color: ac }}>
          Aa
        </span>
      )
    case 'cards':
      return (
        <span className="hm-art-cards">
          <span style={{ background: ac, width: '46%' }} />
          <span style={{ width: '72%' }} />
          <span style={{ width: '34%' }} />
        </span>
      )
    case 'dots':
      return <span className="hm-art-dots" style={{ backgroundImage: `radial-gradient(circle, ${ac} 0, ${ac} 2px, rgba(0,0,0,0) 2.5px)` }} />
    case 'phone':
      return (
        <span className="hm-art-ph">
          <span className="hm-art-ph-b" style={{ background: ac }} />
        </span>
      )
    case 'text1':
      return (
        <span className="hm-gtx">
          <b>Playground</b>
          <br />
          Sketches, experiments &amp; side projects
        </span>
      )
    case 'text2':
      return (
        <span className="hm-gtx">
          Prototyped in
          <br />
          Claude &amp; code
        </span>
      )
    case 'text3':
      return (
        <span className="hm-gtx">
          2026
          <br />
          Made in Ireland
        </span>
      )
    default:
      return null
  }
}

type PlaygroundGridProps = {
  tiles: Tile[]
  playing: boolean
}

export function PlaygroundGrid({ tiles, playing }: PlaygroundGridProps) {
  return (
    <div className="hm-galwrap" aria-label="Playground" {...(playing ? {} : { inert: '' })}>
      <div className="hm-gal">
        {tiles.map((tile) => {
          const art = tile.id !== null
          const bg = tile.kind === 'empty' ? 'rgba(17,17,17,0.06)' : art ? TINTS[tile.colour] : 'transparent'
          return (
            <div
              key={tile.index}
              className={art ? 'hm-gt is-img' : 'hm-gt'}
              style={{ transitionDelay: `${80 + tile.index * 14}ms` } as CSSProperties}
            >
              <div className="hm-gin" style={{ backgroundColor: bg }}>
                <TileArt tile={tile} playing={playing} />
              </div>
              {art && <Link className="hm-gt-hit" to={`/playground/${tile.id}`} aria-label={`Open ${tile.title}`} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BackBar({ playing }: { playing: boolean }) {
  return (
    <div className="hm-backbar" {...(playing ? {} : { inert: '' })}>
      <Link to="/" className="hm-backbtn">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 9 H3 M8 4 L3 9 L8 14" />
        </svg>
        Back to projects
      </Link>
    </div>
  )
}
