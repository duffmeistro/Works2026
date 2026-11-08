import { Block, Callout, Figure, Img, Label, List, Part, Section } from './primitives'

export function Part2Beginnings() {
  return (
    <Part label="Case study: Breeze AI beginnings">
      <Block label="Breeze AI beginnings">
        <Figure>
          <Img
            name="early-beginnings-to-layered-improvements-2.png"
            alt="Early beginnings to layered improvements: the first Breeze Assistant greeting and chat screens beside the refined greeting and the chat with a deal pipeline report"
            width={3024}
            height={1964}
          />
        </Figure>
      </Block>

      <Section title="Early beginnings">
        <p>
          Although mobile was working in tandem with the web Breeze AI product, we also had to figure out what the mobile system and components needed to
          be.
        </p>
        <Label>What I had:</Label>
        <List
          items={[
            'Web style guide and overall HubSpot design system',
            'Core user data from early web features',
            'Breeze brand direction',
            'An early foundation from 2 previous mobile designers',
          ]}
        />
        <Callout>This case study is the progression of the mobile Breeze UI and feature set that I worked solo on over the last 9 months</Callout>
      </Section>
    </Part>
  )
}
