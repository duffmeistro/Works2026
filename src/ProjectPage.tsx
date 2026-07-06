import { motion } from 'framer-motion'
import { getProject } from './data'
import { stagger, rise } from './anim'
import { SiteShell, RevealSection } from './components/site'
import { TextScramble } from './components/text-scramble'

const IMG_STYLE: React.CSSProperties = {
  width: '100%', height: 'auto', display: 'block',
}

function MediaItem({ src }: { src: string }) {
  const isVideo = /\.(mp4|webm|mov)$/i.test(src)
  return isVideo ? (
    <video src={src} autoPlay muted loop playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
  ) : (
    <img src={src} alt="" style={IMG_STYLE} />
  )
}

function Figure({ count, images = [] }: { count: number; images?: string[] }) {
  return (
    <RevealSection className="proj-figure">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div className="proj__media" key={i} variants={rise(40)}>
          {images[i] && <MediaItem src={images[i]} />}
        </motion.div>
      ))}
    </RevealSection>
  )
}

function BentoFigure({ images = [] }: { images?: string[] }) {
  return (
    <RevealSection className="proj-bento">
      <motion.div className="proj-bento__large" variants={rise(40)}>
        {images[0] && <img src={images[0]} alt="" style={IMG_STYLE} />}
      </motion.div>
      <motion.div className="proj-bento__sm" variants={rise(48)}>
        {images[1] && <img src={images[1]} alt="" style={IMG_STYLE} />}
      </motion.div>
      <motion.div className="proj-bento__sm" variants={rise(56)}>
        {images[2] && <img src={images[2]} alt="" style={IMG_STYLE} />}
      </motion.div>
    </RevealSection>
  )
}

const TEMPLATE_STATS = [
  { value: '—', text: 'Outcome data coming soon' },
  { value: '—', text: 'Outcome data coming soon' },
  { value: '—', text: 'Outcome data coming soon' },
]

export default function ProjectPage({ slug }: { slug: string }) {
  const project = getProject(slug)

  if (!project) {
    return (
      <SiteShell>
        <RevealSection className="proj-missing">
          <h1 className="proj-title">No such project.</h1>
          <p className="proj-text__body">
            <a href="#/">&#8592; Back to all work</a>
          </p>
        </RevealSection>
      </SiteShell>
    )
  }

  const { meta, subheadline, signal, constraint, approachIntro, approachItems, outcomeStats, outcomeIntro = [], quote, pageImages = [], preApproachMedia, preOutcomeMedia } =
    project
  const company = project.company.split(': ')[0]

  // slot images: [0]=hero [1]=signal [2,3]=constraint [4]=approach [5,6,7]=bento after outcome
  const heroImg      = pageImages[0]
  const signalImg    = pageImages[1]
  const constraintImgs = pageImages.slice(2, 4)
  const approachImg  = pageImages[4]
  const bentoImgs    = pageImages.slice(5, 8)

  return (
    <SiteShell>
      <motion.header
        className="proj-hero"
        variants={stagger(0.1, 0.1)}
        initial="hidden"
        animate="show"
      >
        <div className="proj-hero__text-row">
          <motion.div className="proj-hero__company-col" variants={rise(16)}>
            <TextScramble as="div" className="proj-company">{company}</TextScramble>
          </motion.div>
          <div className="proj-hero__desc-col">
            <motion.p className="proj-subhead" variants={rise(24)}>{subheadline}</motion.p>
          </div>
          <motion.div className="proj-hero__chips-col" variants={rise(20)}>
            <div className="proj-meta-chips">
              <span className="chip">{meta.year}</span>
              <span className="chip">{meta.industry}</span>
              <span className="chip">{meta.platform}</span>
              <span className="chip">{meta.timeline}</span>
            </div>
          </motion.div>
        </div>
        <motion.div className="proj-hero__media" variants={rise(40)}>
          {heroImg && <img src={heroImg} alt="" style={IMG_STYLE} />}
        </motion.div>
      </motion.header>

      <TextSection name="The Signal" paras={signal} />
      <Figure count={1} images={[signalImg]} />

      <TextSection name="The Constraint" paras={constraint} />
      <Figure count={2} images={constraintImgs} />

      {preApproachMedia && (
        <RevealSection className="proj-figure">
          <motion.div className="proj__media" variants={rise(40)}>
            <MediaItem src={preApproachMedia} />
          </motion.div>
        </RevealSection>
      )}

      <RevealSection className="proj-section">
        <div className="proj-text">
          <TextScramble as="h2" className="proj-text__title">The Approach</TextScramble>
          <motion.div className="proj-text__body" variants={rise(24)}>
            {approachIntro.map((p, i) =>
              p.startsWith('!!') ? (
                <p key={i} className="proj-callout">{p.slice(2).trim()}</p>
              ) : (
                <p key={i}>{p}</p>
              )
            )}
            {approachItems.length > 0 && (
              <dl className="proj-items">
                {approachItems.map((it) => (
                  <div key={it.label}>
                    <dt>{it.label}</dt>
                    <dd>{it.text}</dd>
                  </div>
                ))}
              </dl>
            )}
          </motion.div>
        </div>
      </RevealSection>
      <Figure count={1} images={[approachImg]} />

      {preOutcomeMedia !== undefined && (
        <RevealSection className="proj-figure proj-figure--tight">
          <motion.div className="proj__media" variants={rise(40)}>
            {preOutcomeMedia && <MediaItem src={preOutcomeMedia} />}
          </motion.div>
        </RevealSection>
      )}

      <RevealSection className="proj-outcome">
        <TextScramble as="h2" className="proj-text__title proj-outcome__head">The Outcome</TextScramble>
        {outcomeIntro.length > 0 && (
          <motion.div className="proj-text__body proj-outcome__intro" variants={rise(20)}>
            {outcomeIntro.map((p, i) =>
              p.startsWith('!!') ? (
                <p key={i} className="proj-callout">{p.slice(2).trim()}</p>
              ) : (
                <p key={i}>{p}</p>
              )
            )}
          </motion.div>
        )}
        <motion.div className="proj-ocards" variants={stagger(0.08)}>
          {(outcomeStats.length > 0 ? outcomeStats : TEMPLATE_STATS).map((s, i) => (
            <motion.div className={'proj-ocard' + (s.value.length > 6 ? ' proj-ocard--sm-value' : '')} key={i} variants={rise(28)}>
              <span className="proj-ocard__dot" aria-hidden="true" />
              <span className="proj-ocard__value">{s.value}</span>
              <span className="proj-ocard__text">{s.text}</span>
            </motion.div>
          ))}
        </motion.div>
        {quote && (
          <motion.blockquote className="proj-ocard-quote" variants={rise(20)}>
            <p>&#8220;{quote.text}&#8221;</p>
            <cite>&#8212; {quote.author}</cite>
          </motion.blockquote>
        )}
      </RevealSection>
      <BentoFigure images={bentoImgs} />

      <RevealSection className="proj-allworks">
        <motion.a className="hero__chat hero__chat--dark" href="#works" variants={rise(20)}>
          VIEW ALL WORKS
          <img className="hero__chat-arrow" src="/icons/elastic.svg" alt="" style={{ filter: 'brightness(0) invert(1)' }} />
        </motion.a>
      </RevealSection>
    </SiteShell>
  )
}

function TextSection({ name, paras }: { name: string; paras: string[] }) {
  return (
    <RevealSection className="proj-section">
      <div className="proj-text">
        <TextScramble as="h2" className="proj-text__title">{name}</TextScramble>
        <motion.div className="proj-text__body" variants={rise(24)}>
          {paras.map((p, i) =>
            p.startsWith('!!') ? (
              <p key={i} className="proj-callout">{p.slice(2).trim()}</p>
            ) : (
              <p key={i}>{p}</p>
            )
          )}
        </motion.div>
      </div>
    </RevealSection>
  )
}
