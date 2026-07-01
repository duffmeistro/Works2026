import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RevealSection } from './site'
import { TextScramble } from './text-scramble'
import { rise, stagger } from '../anim'
import { SplashReady } from '../splash'


export function ShowcaseSection({
  id,
  variant = 1,
  showHeading = false,
  title = 'NETCRAFT SOLUTIONS',
  description = '',
  slug,
  year = '2022',
  tags = ['WEB', 'SAAS', 'MOBILE'],
  images = [],
  imagePositions = [],
}: {
  id?: string
  variant?: 1 | 2 | 3 | 4
  showHeading?: boolean
  title?: string
  description?: string
  slug?: string
  year?: string
  tags?: string[]
  images?: string[]
  imagePositions?: string[]
}) {
  const ready = useContext(SplashReady)
  const [headingReady, setHeadingReady] = useState(false)
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setHeadingReady(true), 600)
    return () => clearTimeout(t)
  }, [ready])
  const dashIdx = title.indexOf('. ')
  const company = dashIdx >= 0 ? title.slice(0, dashIdx) : title

  return (
    <RevealSection className={'showcase showcase--v' + variant + (showHeading ? ' showcase--first' : '')} id={id}>
      {showHeading && (
        <div className="showcase__heading-row">
          <div>
            <TextScramble as="h2" className="showcase__title" trigger={headingReady}>Selected Works</TextScramble>
            <motion.span className="showcase__years" variants={rise(16)}>[2021 — 2026]</motion.span>
          </div>
        </div>
      )}

      <motion.div className="showcase__meta" variants={rise(20)}>
        <TextScramble as="div" className="showcase__company">{company}</TextScramble>
        <p className="showcase__desc">{description}</p>
        <div className="showcase__tags">
          {tags.map((t) => (
            <span className="chip" key={t}>{t}</span>
          ))}
          <span className="chip">{year}</span>
        </div>
      </motion.div>

      <motion.a
        className="showcase__row"
        href={slug ? '#/project/' + slug : undefined}
        aria-label={title}
        data-cursor-view
        variants={stagger(0.08)}
      >
        {(['showcase__cell--narrow', 'showcase__cell--feature', 'showcase__cell--photo'] as const).map((mod, i) => {
          const src = images[i]
          const isVideo = src && /\.(mp4|webm|mov)$/i.test(src)
          return (
            <motion.span className={'showcase__cell ' + mod} data-cursor-view variants={rise(40)} key={i}>
              {isVideo ? (
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePositions[i] ?? 'top', display: 'block' }}
                />
              ) : src ? (
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePositions[i] ?? 'top', display: 'block' }} />
              ) : null}
            </motion.span>
          )
        })}
      </motion.a>
    </RevealSection>
  )
}
