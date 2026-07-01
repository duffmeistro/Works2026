import { motion } from 'framer-motion'
import { RevealSection } from './site'
import { TextScramble } from './text-scramble'
import { rise, stagger } from '../anim'
import { journey } from '../data'

export function HowWeWork() {
  return (
    <RevealSection className="hww">
      <div className="hww__head">
        <TextScramble as="h2" className="hww__title">WORK ADVENTURES</TextScramble>
      </div>

      <motion.p className="journey__placeholder" variants={rise(24)}>
        I get a lot of energy figuring out tricky problems. <img className="inline-icon" src="/icons/lightbulb.svg" alt="" />
        Always looking for the simplest, cleanest outcome. <img className="inline-icon" src="/icons/swatches.svg" alt="" />
        Currently digging idea tennis with AI. <img className="inline-icon" src="/icons/startup.svg" alt="" />
        My everyday tools are Claude, Conductor, Notebook LM, Amplitude, and Loom. <img className="inline-icon" src="/icons/laptop.svg" alt="" />
        I may never type again. <img className="inline-icon" src="/icons/confetti.svg" alt="" />
      </motion.p>

      <motion.div className="journey__list hww__jobs" variants={stagger(0.06)}>
        {journey.map((r, i) => (
          <motion.div className="journey__row" key={i} variants={rise(20)}>
            <span className="journey__co">{r.company}</span>
            <span className="journey__role">{r.role}</span>
            <span className="journey__loc">{r.location}</span>
            <span className="journey__period">{r.period}</span>
          </motion.div>
        ))}
      </motion.div>
    </RevealSection>
  )
}
