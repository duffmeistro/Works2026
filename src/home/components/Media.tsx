import { createContext, useContext } from 'react'
import type { Hero, Image, Marquee, Media } from '../projects'
import { PhoneCarousel } from './PhoneCarousel'
import { VoiceAnimation } from './VoiceAnimation'

export const PanelOpenContext = createContext(false)

const PANEL_SIZES = '(max-width: 767px) calc(100vw - 48px), min(1120px, calc(100vw - 272px))'

export function ImageBlock({ image }: { image: Image }) {
  const classes = ['hm-img', 'hm-rise', 'hm-r5']
  if (image.frame) classes.push(`hm-img--${image.frame}`)
  if (image.bg) classes.push('is-fixed')
  return (
    <figure className={classes.join(' ')} style={image.bg ? { backgroundColor: image.bg } : undefined}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={PANEL_SIZES}
        loading="lazy"
        decoding="async"
      />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  )
}

function MarqueeBlock({ marquee }: { marquee: Marquee }) {
  return (
    <figure className="hm-marquee hm-rise hm-r5" aria-label={marquee.label}>
      {marquee.columns.map((col, i) => (
        <div key={i} className="hm-marquee__col">
          <div className={i === 0 ? 'hm-mq-track hm-mq-up' : 'hm-mq-track hm-mq-down'}>
            {[...col, ...col].map((img, k) => (
              <img
                key={k}
                src={img.src}
                alt={k < col.length ? img.alt : ''}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      ))}
    </figure>
  )
}

function VoiceHero({ label, running }: { label: string; running: boolean }) {
  return (
    <figure className="hm-phones hm-phones--hero hm-voicehero hm-rise hm-r3" aria-label={label}>
      <div className="hm-phones__static">
        <div className="hm-phone hm-phone--flat">
          <div className="hm-phone__screen">
            <div className="hm-voicehero__scale">
              <VoiceAnimation running={running} />
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}

export function HeroBlock({ hero }: { hero: Hero }) {
  const open = useContext(PanelOpenContext)
  switch (hero.kind) {
    case 'image':
      return <ImageBlock image={hero} />
    case 'carousel':
      return <PhoneCarousel carousel={hero} running={open} className="hm-rise hm-r3" />
    case 'voice-animation':
      return <VoiceHero label={hero.label} running={open} />
  }
}

export function MediaBlock({ media, rise = 'hm-r5' }: { media: Media; rise?: string }) {
  const open = useContext(PanelOpenContext)
  switch (media.kind) {
    case 'image':
      return <ImageBlock image={media} />
    case 'carousel':
      return <PhoneCarousel carousel={media} running={open} className={`hm-rise ${rise}`} />
    case 'marquee':
      return <MarqueeBlock marquee={media} />
  }
}

export function MediaGroup({ items }: { items: Media[] }) {
  if (items.length === 0) return null
  if (items.length === 1) return <MediaBlock media={items[0]} />
  return (
    <div className="hm-media-group">
      {items.map((m, i) => (
        <MediaBlock key={i} media={m} />
      ))}
    </div>
  )
}
