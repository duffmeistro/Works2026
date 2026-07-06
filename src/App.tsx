import { useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { stagger, rise } from './anim'
import { SplashReady } from './splash'
import { SiteShell, RevealSection } from './components/site'
import { TextScramble } from './components/text-scramble'
import { ShowcaseSection } from './components/ShowcaseSection'
import { HowWeWork } from './components/HowWeWork'

const projects = [
  {
    slug: 'hubspot-console',
    title: 'HubSpot. How mobile data capture became a Breeze.',
    description:
      'Unstructured field data, turned into something HubSpot mobile users could leverage. AI call logging, meeting capture, and Breeze AI all built into mobile.',
    year: '2026',
    tags: ['MOBILE', 'AI', 'CRM'],
    images: [
      '/images/hubspot-console/b.jpg',
      '/images/hubspot-console/breezetrio.mp4',
      '/images/hubspot-console/c.jpg',
    ],
  },
  {
    slug: 'hubspot-crm',
    title: "HubSpot. Their CRM lived on a desk. Their leads didn't.",
    description:
      'Field reps were qualifying 3 leads a month on web. How mobile pushed that to 7. Doubling their lead qualification.',
    year: '2025',
    tags: ['MOBILE', 'CRM'],
    images: [
      '/images/hubspot-crm/2.jpg',
      '/images/hubspot-crm/leadsshort.mp4',
      '/images/hubspot-crm/3.jpg',
    ],
    imagePositions: ['top', 'center', 'top'],
    objectFits: ['cover', 'cover', 'cover'],
  },
  {
    slug: 'glofox',
    title: 'Glofox. Gym owners were losing leads while teaching spin class.',
    description:
      'Gym owners were losing leads while on the gym floor. Amplify turned them into paying customers at 2.5x the rate with automated, personalised outreach.',
    year: '2023',
    tags: ['WEB', 'GYM CRM'],
    images: [
      '/images/glofox/1.jpg',
      '/images/glofox/2.jpg',
      '/images/glofox/3.jpg',
    ],
  },
  {
    slug: 'movember',
    title:
      'Movember. One campaign. One month. Every 1% we moved on conversion was worth a million dollars.',
    description:
      'Every 1% on conversion worth a million dollars for the hairiest fundraising platform on earth. Designing for sign-up conversion, fundraiser retention, the moments that made people come back.',
    year: '2021',
    tags: ['WEB', 'MOBILE'],
    images: [
      '/images/movember/1.jpg',
      '/images/movember/2.jpg',
      '/images/movember/3.jpg',
    ],
  },
]

export default function App() {
  // hero animations hold until the splash screen has lifted away
  const ready = useContext(SplashReady)

  // arriving from a project page with #works / #contact: scroll to that section
  useEffect(() => {
    const id = window.location.hash.replace(/^#\/?/, '')
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <SiteShell>
      {/* ---------- Hero (reveals once the splash lifts, staggered) ---------- */}
      <motion.header
        className="hero"
        id="top"
        variants={stagger(0.08, 0.1)}
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
      >
        {/* Col 1 Row 1 — name + role + IRL */}
        <motion.div className="hero__name-block" variants={rise(20)}>
          <TextScramble as="h1" className="hero__name" trigger={ready}>GAVAN DUFFY</TextScramble>
          <TextScramble as="div" className="hero__role" trigger={ready}>Senior Product Designer</TextScramble>
          <div className="hero__meta">
            <span className="hero__based">Based in Ireland</span>
          </div>
        </motion.div>

        {/* Col 2 Row 1 — paragraph */}
        <motion.p className="hero__about" variants={rise(24)}>
          10+ years designing digital products at scale. Big teams, research, craft, code, the works.
          Happiest when I'm in the thick of it with ambitious people.
        </motion.p>

        {/* Col 3 Row 1 — pill placeholder */}
        <motion.div className="hero__pill" variants={rise(30)} />

        {/* Col 1 Row 2 — CTA */}
        <motion.div className="hero__cta" variants={rise(20)}>
          <span className="hero__peace">
            <img className="hero__peace-icon" src="/icons/peace.svg" alt="" />
            <img className="hero__avatar" src="/images/personal/profile2.jpg" alt="Gavan Duffy" />
          </span>
          <a className="hero__chat" href="#contact">
            GET IN TOUCH
          </a>
        </motion.div>

        {/* Col 3 Row 2 — scroll hint */}
        <motion.a className="hero__scroll-hint" href="#works" variants={rise(20)} aria-label="Scroll to work">
          <img className="showcase__down-arrow" src="/arrow.svg" alt="" />
        </motion.a>
      </motion.header>

      {/* ---------- Selected work — four project showcase sections (mismatched widths) ---------- */}
      {projects.map((p, i) => (
        <ShowcaseSection
          key={i}
          id={i === 0 ? 'works' : i === 1 ? 'project-2' : undefined}
          variant={(i + 1) as 1 | 2 | 3 | 4}
          showHeading={i === 0}
          title={p.title}
          description={p.description}
          slug={p.slug}
          year={p.year}
          tags={p.tags as string[]}
          images={'images' in p ? (p.images as string[]) : []}
          imagePositions={'imagePositions' in p ? (p.imagePositions as string[]) : []}
          objectFits={'objectFits' in p ? (p.objectFits as string[]) : []}
        />
      ))}

      {/* ---------- My Workflows ---------- */}
      <HowWeWork />

      {/* ---------- Life Adventures ---------- */}
      <RevealSection className="journey" id="about">
        <TextScramble as="h2" className="journey__heading">LIFE ADVENTURES</TextScramble>
        <motion.p className="journey__placeholder" variants={rise(24)}>
          When I clock off, I'm outside, hiking <img className="inline-icon" src="/icons/mountain.svg" alt="" /> sea swimming <img className="inline-icon" src="/icons/swimming.svg" alt="" />
          or signing up for trail races I've probably under-trained for. <img className="inline-icon" src="/icons/sneaker.svg" alt="" />
          Rain <img className="inline-icon" src="/icons/cloud-rain.svg" alt="" /> or shine <img className="inline-icon" src="/icons/sun.svg" alt="" /> doesn't matter.
          Always game for a coffee <img className="inline-icon" src="/icons/coffee.svg" alt="" /> or random day out. <img className="inline-icon" src="/icons/wave.svg" alt="" />
        </motion.p>
        <motion.div className="photo-strip" variants={stagger(0.06)}>
          {([
            '/images/personal/profile.jpg',
            '/images/personal/1.jpg',
            '/images/personal/3.jpg',
            '/images/personal/2.jpg',
          ]).map((src, i) => (
            <motion.div
              key={i}
              className="photo-strip__cell"
              variants={rise(24 + i * 8)}
            >
              <img src={src} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </motion.div>
          ))}
        </motion.div>
      </RevealSection>
    </SiteShell>
  )
}
