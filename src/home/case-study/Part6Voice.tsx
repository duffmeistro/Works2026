import { BreezeVoice } from './BreezeVoice'
import { Device } from './Device'
import { PhoneCarousel, type Shot } from './PhoneCarousel'
import { asset, Block, Label, Part, Section, Tag } from './primitives'
import s from './Part6Voice.module.css'

const SHOTS: Shot[] = [
  {
    name: 'voice-conversation-answering-a-question-about-the.jpg',
    alt: 'Voice conversation answering a question about the last deal created',
    width: 375,
    height: 812,
  },
  { name: 'voice-mode-connecting.jpg', alt: 'Voice mode connecting', width: 375, height: 812 },
  { name: 'voice-mode-ready-to-chat.jpg', alt: 'Voice mode ready to chat', width: 375, height: 812 },
  {
    name: 'voice-settings-sheet-with-the-shimmer-voice.jpg',
    alt: 'Voice settings sheet with the Shimmer voice and speed options',
    width: 375,
    height: 812,
  },
]

export function Part6Voice() {
  return (
    <Part label="Case study: Breeze Voice">
      <div className={s.intro}>
        <p className={s.lead}>{' '}. . . Enter Breeze Voice</p>

        <Section title={'"HEY BREEZE..."'}>
          <p>
            Then came Breeze Voice, the next layer of interacting with your CRM. This was a great use case for our reps on the road, they might be
            driving or walking between meetings and needed some quick info or some conversational question threads.
          </p>
          <p>
            Designing for AI and voice meant designing for uncertainty: often the model can be slow, results were not always consistent, customers’
            expectations were that the speed and use case coverage would be as slick as frontier AI apps in the market.
          </p>
          <Label>VOICE CHALLENGES</Label>
          <ol className="cs-list">
            <li>
              <strong>New AI model to link into.</strong> A task for our engineering crew to link up to OpenAI live voice models
            </li>
            <li>
              <strong>New interaction mode for users.</strong> Voice or STT for that matter was a new modality for many of our customers
            </li>
            <li>
              <strong>Building the voice and tone for Breeze.</strong>
              {' '}Challenges for our team to make it unique to HubSpot and suitable for their language.
            </li>
            <li>
              <strong>Scaling to web (eventually).</strong> Mobile was tasked with leading the way,{' '} with the goal of plugging this into the web
              product
            </li>
          </ol>
        </Section>

        <Block label="BREEZE VOICE INTRO">
          <figure className={`cs-fig ${s.voiceFigure}`} role="img" aria-label="Breeze voice: loading, ready to chat and talking back">
            <Device size="md">
              <div className={s.voiceScale}>
                <BreezeVoice />
              </div>
            </Device>
          </figure>
        </Block>

        <Section title={' VOICE HYPE'}>
          <p>There was an early adopter mentality around a Voice product but the hype was real.</p>
        </Section>

        <div className="cs-block">
          <figure className={`cs-fig ${s.slack}`}>
            <img
              src={asset('slack-message-from-dharmesh-shah.jpg')}
              alt="Slack message from Dharmesh Shah: OK, now I’m out of my chair. Breeze Assistant voice!"
              width={1512}
              height={982}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <Tag>A new way of working for everyone</Tag>
        </div>
      </div>

      <Block label="Voice as a new modality">
        <PhoneCarousel label="Breeze voice screens carousel" shots={SHOTS} />
      </Block>
    </Part>
  )
}
