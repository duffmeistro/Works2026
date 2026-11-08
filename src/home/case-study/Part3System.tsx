import { PhoneCarousel, type Shot } from './PhoneCarousel'
import { Block, Callout, Figure, Img, Label, List, Part, Quote, Section } from './primitives'

const SHOTS: Shot[] = [
  {
    name: 'breeze-assistant-greeting.jpg',
    alt: 'Breeze Assistant greeting: Hi Gavan, how can I help you? with suggested prompts',
    width: 563,
    height: 1218,
  },
  {
    name: 'breeze-assistant-overflow-menu.jpg',
    alt: 'Breeze Assistant overflow menu: New chat, Chats, Artifacts, Projects and Prompts',
    width: 563,
    height: 1215,
  },
  {
    name: 'chats-list-showing-loading-selected-unread-scheduled.jpg',
    alt: 'Chats list showing loading, selected, unread, scheduled and needs-reply thread states',
    width: 563,
    height: 1218,
  },
  {
    name: 'breeze-handing-a-request-to-the-prospecting.jpg',
    alt: 'Breeze handing a request to the Prospecting agent and replying in the chat',
    width: 563,
    height: 1215,
  },
]

export function Part3System() {
  return (
    <Part label="Case study: Building the Breeze mobile UI system">
      <Block label="BUILDING THE BREEZE MOBILE UI SYSTEM">
        <Figure>
          <Img
            name="breeze-assistant-component-library.jpg"
            alt="Breeze Assistant component library: header, loading states, agent invoke, chat input, artifacts, tasks, text bubbles, overflow menu, notifications, blockers and nudges"
            width={1512}
            height={1047}
          />
        </Figure>
      </Block>

      <Section title="What I shaped">
        <p>
          How AI and voice behave in a rep’s hand on mobile was mine to define. Working with the lead web team to adopt their features and learn from
          their user data to understand what could land on mobile.{' '}
        </p>
        <Callout>
          Not only was this about UI-centric problems, it was also about the experience, the onboarding, and the overall latency and experience of
          Breeze AI, and the two modalities of text and voice on mobile.
        </Callout>
        <Label>WHAT I PROGRESSED:</Label>
        <List
          items={[
            'Mobile entry points and discovery for Breeze AI features',
            'Breeze AI response experience: what the rep sees between prompting and our AI response',
            'Voice interactions: how a rep starts, speaks, pauses, how Breeze listens, thinks, responds, handles errors, how it motions',
            'Mobile led the way on Voice',
            'Growth experiments on onboarding and re-engagement',
          ]}
        />
      </Section>

      <Block label="Breeze AI on mobile">
        <PhoneCarousel label="Breeze Assistant screens carousel" shots={SHOTS} />
      </Block>

      <Section title="Challenges">
        <p>
          Designing for AI and voice meant designing for uncertainty: often the model can be slow, results were not always consistent, customers’
          expectations were that the speed and use case coverage would be as slick as frontier AI apps in the market.
        </p>
        <Label>DESIGN TEAM CHALLENGES:</Label>
        <ol className="cs-list">
          <li>
            <strong>Latency is inevitable.</strong> Transcription and generation take time, we needed to be clear on what the system was doing
          </li>
          <li>
            <strong>AI can be confidently wrong.</strong> A misheard name or the wrong deal pollutes the CRM, and challenges trust
          </li>
          <li>
            <strong>Voice should be conversational.</strong> The experience needed to match a natural chat flow and response time expectation
          </li>
          <li>
            <strong>One AI, many surfaces.</strong> Mobile and web needed to be a shared experience as reps worked between both. It was often hard to
            keep parity given mobile needed to be in native code
          </li>
        </ol>
      </Section>

      <Quote
        text="The conversation had a natural conversation element that feels comfortable and easy. This needs to be a feature for Desktop as well."
        by="JEREMY, ADMIN, USA"
      />
    </Part>
  )
}
