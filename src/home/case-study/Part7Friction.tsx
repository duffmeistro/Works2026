import { Callout, Label, List, Part, Quote, Section } from './primitives'

export function Part7Friction() {
  return (
    <Part label="Case study: Friction challenges">
      <Section title="Friction challenges">
        <p>
          While many things can be fixed in design, the age-old experience factors of things like latency, consistency and transparency were emerging as
          the main friction points.&nbsp;
        </p>
        <Callout>
          This was a real collaborative approach that the team had to take on to improve the user experience. Not only in design but with backend
          engineering performance also
        </Callout>
        <div />
        <Label>Friction examples:</Label>
        <List
          items={[
            <>
              <b>Funnel: </b>62.0% of Breeze users haven't tapped the Voice CTA.
            </>,
            <>
              <b>Setup friction: </b>16.4% of users are lost between activation and a successful connection (1,871 → 1,564).
            </>,
            <>
              <b>Latency: </b>59.2% of turns take over 8s, and only 6.2% respond in under 2s.
            </>,
            <>
              <b>Barge-ins: </b>barge-ins make up 38.5% of turn outcomes (12,845 vs 20,357 completed answers)
            </>,
            <>
              <b>Retention: </b>D30 retention is 2.9% for voice vs ~20.7% for text, and voice has a 13-point D1 deficit.
            </>,
          ]}
        />
      </Section>

      <Quote
        text="Sometimes voice cuts me off and writes the note with out letting me finish conversation . . .Voice also isn't aware about prompts that I have saved."
        by="Sales rep, beta tester, USA"
      />
    </Part>
  )
}
