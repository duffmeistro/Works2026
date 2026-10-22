import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ACCENTS, TINTS, type Tile } from '../playground'

const WAVE_BARS = Array.from({ length: 9 }, (_, i) => i)

export function TileArt({ tile }: { tile: Tile }) {
  const ac = ACCENTS[tile.colour]
  const bg = TINTS[tile.colour]
  switch (tile.kind) {
    case 'v1':
      return <img className="hm-gimg" src="/work/home/voice-ai-phone-right.png" alt="Voice assistant conversation screen" />
    case 'v2':
      return <img className="hm-gimg" src="/work/home/voice-ai-phone-left.png" alt="Voice assistant ready to chat screen" />
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
                <TileArt tile={tile} />
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
