import type { Carousel, Hero, Image, Marquee, Media } from '../projects'

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

function FlatPhone({ screen }: { screen: Image }) {
  return (
    <div className="hm-phone hm-phone--flat">
      <div className="hm-phone__screen">
        <img className="hm-screen__img" src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} loading="lazy" decoding="async" />
        <span className="hm-phone__island" />
      </div>
    </div>
  )
}

function PhoneStrip({ carousel, rise }: { carousel: Carousel; rise: string }) {
  return (
    <figure className={`hm-phones hm-phones--hero hm-phones--carousel hm-rise ${rise}`} aria-label={carousel.label}>
      <div className="hm-phones__static">
        {carousel.screens.slice(0, 3).map((s) => (
          <FlatPhone key={s.src} screen={s} />
        ))}
      </div>
    </figure>
  )
}

function MarqueeBlock({ marquee }: { marquee: Marquee }) {
  return (
    <figure className="hm-marquee hm-rise hm-r5" aria-label={marquee.label}>
      {marquee.columns.map((col, i) => (
        <div key={i} className="hm-marquee__col">
          {col.map((img) => (
            <img key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
          ))}
        </div>
      ))}
    </figure>
  )
}

function VoiceHero({ label }: { label: string }) {
  return (
    <figure className="hm-phones hm-phones--hero hm-voicehero hm-rise hm-r3" aria-label={label}>
      <div className="hm-phones__static">
        <div className="hm-phone hm-phone--flat">
          <div className="hm-phone__screen">
            <img className="hm-screen__img" src="/work/voice-ai/carousel-3-ready.jpg" alt="" width={375} height={812} loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </figure>
  )
}

export function HeroBlock({ hero }: { hero: Hero }) {
  switch (hero.kind) {
    case 'image':
      return <ImageBlock image={hero} />
    case 'carousel':
      return <PhoneStrip carousel={hero} rise="hm-r3" />
    case 'voice-animation':
      return <VoiceHero label={hero.label} />
  }
}

export function MediaBlock({ media, rise = 'hm-r5' }: { media: Media; rise?: string }) {
  switch (media.kind) {
    case 'image':
      return <ImageBlock image={media} />
    case 'carousel':
      return <PhoneStrip carousel={media} rise={rise} />
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
