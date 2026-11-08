import { asset, Block, Label, List, Part, Section } from './primitives'
import s from './Part8Growth.module.css'

const SHOTS = [
  { name: 'breeze-assistant-chat-with-a-tooltip-suggesting.png', alt: 'Breeze Assistant chat with a tooltip suggesting voice mode' },
  { name: 'mobile-home-screen-with-a-try-breeze.png', alt: 'Mobile home screen with a Try Breeze Assistant Voice card' },
  { name: 'talk-to-breeze-assistant-intro-block-with.png', alt: 'Talk to Breeze Assistant intro block with a Try Voice button' },
  { name: 'voice-mode-ready-to-chat-with-a.png', alt: 'Voice mode ready to chat with a suggested prompt' },
]

export function Part8Growth() {
  return (
    <Part label="Case study: Growth experiments">
      <Section title="Growth experiments">
        <p>
          In an ideal world, we would test our designs and get user feedback, but we leaned a lot into data and quick experiments to see if we could
          improve many parts of the Voice feature that we were getting feedback on, including onboarding, adoption and retention.
        </p>
        <Label>Experiments:</Label>
        <List items={['Tooltip signposting for Voice', 'In-app hooks', 'Breeze thread creative', 'Empty state suggested prompts']} />
      </Section>

      <Block label="Onboarding experiments">
        <figure
          className={s.fig}
          aria-label="Four Breeze voice onboarding screens side by side: chat tooltip, home card, Try Voice intro and voice ready state"
        >
          {SHOTS.map((shot) => (
            <img key={shot.name} className={s.shot} src={asset(shot.name)} alt={shot.alt} width={375} height={812} loading="lazy" decoding="async" />
          ))}
        </figure>
      </Block>
    </Part>
  )
}
