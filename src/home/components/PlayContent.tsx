import type { CSSProperties } from 'react'
import { ACCENTS, TINTS, type Tile } from '../playground'

export function PlayContent({ tile }: { tile: Tile }) {
  const style = { backgroundColor: TINTS[tile.colour], '--accent': ACCENTS[tile.colour] } as CSSProperties
  return (
    <>
      <header className="hm-rise hm-r1 hm-case__head">
        <div className="hm-case__kicker">
          <span>Playground · {tile.number}</span>
          <span>2026</span>
        </div>
        <h2 className="hm-case__title">{tile.title}</h2>
        <p className="hm-case__sub">[A short paragraph on what this experiment is, why you made it and what you learned.]</p>
      </header>
      <div className="hm-rise hm-r3 hm-playfigs">
        <figure className="hm-fig hm-fig--hero" style={style}>
          <div className="hm-fig__pill" aria-hidden="true" />
          <figcaption>[Image 01]</figcaption>
        </figure>
        <div className="hm-playfigs__pair">
          <figure className="hm-fig hm-fig--tall" style={style}>
            <figcaption>[Image 02]</figcaption>
          </figure>
          <figure className="hm-fig hm-fig--tall" style={style}>
            <figcaption>[Image 03]</figcaption>
          </figure>
        </div>
      </div>
    </>
  )
}
