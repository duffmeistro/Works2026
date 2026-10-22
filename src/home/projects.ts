import type { ChartSpec } from './charts'

export type Image = {
  kind: 'image'
  src: string
  alt: string
  width: number
  height: number
  srcSet?: string
  caption?: string
  frame?: 'padded' | 'inset'
  bg?: string
}

export type Carousel = { kind: 'carousel'; label: string; screens: Image[] }
export type Marquee = { kind: 'marquee'; label: string; columns: [Image[], Image[]] }
export type VoiceAnimation = { kind: 'voice-animation'; label: string }

export type Media = Image | Carousel | Marquee
export type Hero = Image | Carousel | VoiceAnimation

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; items: string[] }
  | { type: 'quote'; text: string; by: string }

export type Section = {
  n: string
  title: string
  blocks: Block[]
  after: Media[]
}

export type Stage =
  | { kind: 'none' }
  | { kind: 'angled'; screens: [Image, Image] }
  | { kind: 'solo'; screen: Image }
  | { kind: 'pair'; screens: [Image, Image] }
  | { kind: 'monitor'; screen: Image }

export type MetaItem = { k: string; v: string }
export type Metric = { value: string; label: string; chart: string; viz: ChartSpec }

export type Project = {
  slug: string
  tab: string
  tabShort: string
  name: string
  homeName: string
  year: string
  homeDescription: string
  headline: string
  intro: string
  meta: MetaItem[]
  metrics: Metric[]
  sections: Section[]
  quote: string
  quoteBy: string
  stage: Stage
  hero: Hero | null
  afterMetrics: Media | null
  end: Image[]
}

export const projects: Project[] = [
  {
    slug: 'about',
    tab: 'About',
    tabShort: 'About',
    name: 'ABOUT',
    homeName: '',
    year: '',
    homeDescription: '',
    headline: 'Hey, I’m Gav.',
    intro: 'I’m a senior product designer with 10+ years in tech, now at HubSpot, designing AI-assisted tools for sales and productivity. My work spans mobile CRM, meeting capture and growth, and I build the prototypes myself.',
    meta: [{ k: 'Role', v: 'Senior Product Designer' }, { k: 'Currently @', v: 'HubSpot' }, { k: 'Experience', v: '10+ years in tech' }, { k: 'Based', v: 'Ireland' }],
    metrics: [],
    sections: [
      {
        n: '01',
        title: 'How I work',
        blocks: [
          { type: 'p', text: 'I get a lot of energy figuring out tricky problems, always looking for the simplest, cleanest outcome.' },
        ],
        after: [],
      },
      {
        n: '02',
        title: 'Everyday tools',
        blocks: [
          { type: 'p', text: 'Claude, Figma, Conductor, GitHub, NotebookLM, Amplitude and Loom. I may never type again. You can check out some of my process below.' },
        ],
        after: [],
      },
    ],
    quote: '',
    quoteBy: '',
    stage: { kind: 'none' },
    hero: null,
    afterMetrics: null,
    end: [
      { kind: 'image', src: '/work/about/01-figjam-canvas.jpg', alt: 'FigJam board with voice onboarding flows, sticky-note ideation and research summaries', width: 1512, height: 982, srcSet: '/work/about/01-figjam-canvas-800.jpg 800w, /work/about/01-figjam-canvas.jpg 1512w', caption: '[Figma and FigJam have become my canvas]' },
      { kind: 'image', src: '/work/about/02-research-synthesis.jpg', alt: 'Claude chat summarising the main themes from a pasted transcript', width: 1512, height: 982, srcSet: '/work/about/02-research-synthesis-800.jpg 800w, /work/about/02-research-synthesis.jpg 1512w', caption: '[Research synthesis — pulling themes from a transcript with Claude]' },
      { kind: 'image', src: '/work/about/03-claude-design-ideation.jpg', alt: 'Claude Design canvas with four iOS glass navigation options', width: 1512, height: 982, srcSet: '/work/about/03-claude-design-ideation-800.jpg 800w, /work/about/03-claude-design-ideation.jpg 1512w', caption: '[Claude Design has become my ideation partner]' },
      { kind: 'image', src: '/work/about/04-prototyping-in-code.jpg', alt: 'Coded phone prototype of the Breeze voice picker with a theme switcher, in light and dark', width: 1512, height: 982, srcSet: '/work/about/04-prototyping-in-code-800.jpg 800w, /work/about/04-prototyping-in-code.jpg 1512w', caption: '[Prototyping in code — the medium we build in]' },
      { kind: 'image', src: '/work/about/05-shipping-in-code.jpg', alt: 'GitHub branch list and a draft pull request for voice settings polish', width: 1512, height: 982, srcSet: '/work/about/05-shipping-in-code-800.jpg 800w, /work/about/05-shipping-in-code.jpg 1512w', caption: '[Shipping in code — prototype branches and a voice settings PR]' },
      { kind: 'image', src: '/work/about/06-ux-content-claude-skills.jpg', alt: 'Claude chat refining a Breeze Assistant meeting notification', width: 1512, height: 982, srcSet: '/work/about/06-ux-content-claude-skills-800.jpg 800w, /work/about/06-ux-content-claude-skills.jpg 1512w', caption: '[Product UX content — Claude skills]' },
    ],
  },
  {
    slug: 'voice-ai',
    tab: 'Voice AI',
    tabShort: 'Voice AI',
    name: 'BREEZE VOICE',
    homeName: 'HubSpot Breeze Voice AI',
    year: '2026',
    homeDescription: 'Creating a new modality to interact with your CRM while you’re on the move. No tapping necessary with Breeze Voice.',
    headline: 'A new modality to interact with your CRM with Breeze Voice AI',
    intro: 'Creating a new modality to interact with your CRM while you’re on the move. No tapping necessary with Breeze Voice.',
    meta: [{ k: 'Company', v: 'HubSpot' }, { k: 'Project', v: 'Breeze Voice AI' }, { k: 'Timeline', v: '4 months' }, { k: 'Role', v: 'Senior Product Designer' }],
    metrics: [
      { value: '+4k', label: 'Daily active Breeze users on voice, with ~10% of all Breeze users having tried Voice', chart: 'Dotted ring lit around 10 percent of its circumference: about one in ten Breeze users has tried Voice', viz: { kind: 'ring', pct: 0.1 } },
      { value: '+65%', label: 'Latency improvement since the first beta', chart: 'Two dot bars: response time now is about a third of the first beta, 65 percent faster', viz: { kind: 'bars', rows: [{ label: 'First beta', cols: 32 }, { label: 'Now · 65% faster', cols: 11, accent: 'last' }] } },
      { value: '18%', label: 'Of users prompt through speech to text', chart: 'Grid of 100 dots with 18 lit: 18 percent of users prompt through speech to text', viz: { kind: 'share', n: 18, total: 100, cols: 10, note: '18 in every 100 users' } },
    ],
    sections: [
      {
        n: '01',
        title: 'The signal',
        blocks: [
          { type: 'p', text: 'As Breeze, HubSpot’s AI assistant, gained traction, the feedback was consistent: people loved how it worked. No more tapping through records and screens on the way to a client meeting.' },
          { type: 'p', text: 'The next ask was clear. Reps wanted to talk to HubSpot while driving or walking between meetings. They wanted a quick brief on who they’re seeing and what to prep, without the tapping and manual effort of a traditional UI.' },
          { type: 'p', text: 'So we leaned into voice AI and got to work on something for reps on the road.' },
          { type: 'quote', text: 'I’m definitely going to use AI much more… I’m driving all the time, so I want to be able to open up something like ChatGPT, or directly to you, and verbally tell you things to do.', by: 'HubSpot Sales Hub user' },
        ],
        after: [
          { kind: 'image', src: '/work/voice-ai/slack-shout-out.jpg', alt: 'Slack message from Dharmesh Shah: OK, now I’m out of my chair. Breeze Assistant voice!', width: 1512, height: 982, srcSet: '/work/voice-ai/slack-shout-out-800.jpg 800w, /work/voice-ai/slack-shout-out.jpg 1512w', caption: '[A shout-out from Dharmesh in #science-fair]' },
        ],
      },
      {
        n: '02',
        title: 'The constraint',
        blocks: [
          { type: 'p', text: 'Voice products were still new, and our own Breeze harness was hitting problems of its own: latency, and the sheer depth of data customers hold in their CRM.' },
          { type: 'p', text: 'We were a small team of six, mostly back-end engineers with a couple on the front end. The challenge was balancing two things: a voice experience natural enough to hold a real conversation, and one that could still query everything a rep needed. Anything less would put people off voice for good and become a quick churn risk.' },
        ],
        after: [],
      },
      {
        n: '03',
        title: 'The approach',
        blocks: [
          { type: 'p', text: 'We had a stellar engineering team on this, and they leaned right into the user experience we were going for. Making voice feel natural meant constant testing and iteration on the tools and techniques that cut latency, kept conversations flowing, and handled the small background details that make or break a voice product.' },
          { type: 'callout', title: 'The big ones:', items: ['Latency, the biggest of all', 'Barge-in, so people can interrupt Breeze mid-sentence', 'Local tone, feel and language', 'Introducing a whole new way to interact with the CRM', 'Keeping parity as new features shipped across the company'] },
          { type: 'p', text: 'From a design point of view, the UI was deliberately minimal. Most of the craft went into making the system’s state clear: when Breeze was listening, thinking, checking tools or talking back. That was as much a voice interaction problem as a UI one.' },
          { type: 'p', text: 'Later, we leaned further into voice. Invoking Breeze Voice through Siri gave reps a truly hands-free experience on iOS, and tying it into Breeze’s native chat let people flick between typing and talking without missing a beat.' },
        ],
        after: [
          { kind: 'image', src: '/work/voice-ai/component-library.jpg', alt: 'Breeze voice component library: buttons, gradients, connection states, voice pill, Siri prompt and Try Voice block', width: 1512, height: 982, srcSet: '/work/voice-ai/component-library-800.jpg 800w, /work/voice-ai/component-library.jpg 1512w', caption: '[Breeze voice — component library]', frame: 'inset' },
        ],
      },
      {
        n: '04',
        title: 'The outcome',
        blocks: [
          { type: 'p', text: 'At the end of a short project window, we launched Breeze Voice AI at Unbound, HubSpot’s annual conference. Feedback from early testers and our private beta group was strong.' },
          { type: 'p', text: 'Since launch, we’ve combined that research with usage data and run growth experiments to keep improving it. One clear finding: first-time users were a little nervous about the new modality and unsure what they could ask, so we’re now working on a better first-run experience.' },
          { type: 'p', text: 'Alongside that, we’re continuing to bring latency down, and we’ve hired a voice actor to give Breeze a native, branded HubSpot voice.' },
        ],
        after: [
          { kind: 'marquee', label: 'Breeze voice entry points: chat tooltip, home card, voice ready state and Try Voice intro', columns: [[{ kind: 'image', src: '/work/voice-ai/marquee-1-chat-tooltip.png', alt: 'Breeze Assistant chat with a tooltip suggesting voice mode', width: 375, height: 812 }, { kind: 'image', src: '/work/voice-ai/marquee-3.png', alt: 'Mobile home screen with a Try Breeze Assistant Voice card', width: 375, height: 812 }], [{ kind: 'image', src: '/work/voice-ai/marquee-4.png', alt: 'Voice mode ready to chat with a suggested prompt', width: 375, height: 812 }, { kind: 'image', src: '/work/voice-ai/marquee-2.png', alt: 'Talk to Breeze Assistant intro block with a Try Voice button', width: 375, height: 812 }]] },
        ],
      },
      {
        n: '05',
        title: 'Adoption and growth',
        blocks: [
          { type: 'p', text: 'It’s still early days since we launched our voice product, but we’ve been collecting tons of data from our users and digging into growth experiments, and into the nuances of the UI and interaction patterns we can fix. A lot done, and we’re always looking to improve the experience for customers. Here’s some of what we’ve found:' },
          { type: 'list', items: ['Funnel: only 20.6% of Breeze home screen viewers (1,021 of 4,955) complete an answered turn, and 62.0% never tap the Voice CTA.', 'Setup friction: 16.4% of users are lost between activation and a successful connection (1,871 → 1,564).', 'Latency: 59.2% of turns take over 8s, and only 6.2% respond in under 2s.', 'Barge-ins and depth: barge-ins make up 38.5% of turn outcomes (12,845 vs 20,357 completed answers), and 52.1% of sessions end after 0 or 1 turn.', 'Retention: D30 retention is 2.9% for voice vs ~20.7% for text, and voice has a 13-point D1 deficit.'] },
        ],
        after: [
          { kind: 'image', src: '/work/voice-ai/adoption-analysis.jpg', alt: 'Analysis of voice adoption: a funnel from 4,955 viewers to 1,021 answered turns, with latency and retention stats', width: 1512, height: 982, srcSet: '/work/voice-ai/adoption-analysis-800.jpg 800w, /work/voice-ai/adoption-analysis.jpg 1512w', caption: '[Finding why voice adoption stalled]' },
        ],
      },
    ],
    quote: '',
    quoteBy: '',
    stage: { kind: 'angled', screens: [{ kind: 'image', src: '/work/home/voice-ai-phone-left.jpg', alt: 'Voice assistant ready to chat', width: 563, height: 1218 }, { kind: 'image', src: '/work/home/voice-ai-phone-right.jpg', alt: 'Voice assistant answering a question about the last deal created', width: 563, height: 1218 }] },
    hero: { kind: 'voice-animation', label: 'Breeze voice: loading, ready to chat and talking back' },
    afterMetrics: { kind: 'carousel', label: 'Voice AI screens carousel', screens: [{ kind: 'image', src: '/work/voice-ai/carousel-1-conversation.jpg', alt: 'Voice conversation answering a question about the last deal created', width: 375, height: 812 }, { kind: 'image', src: '/work/voice-ai/carousel-2-connecting.jpg', alt: 'Voice mode connecting', width: 375, height: 812 }, { kind: 'image', src: '/work/voice-ai/carousel-3-ready.jpg', alt: 'Voice mode ready to chat', width: 375, height: 812 }, { kind: 'image', src: '/work/voice-ai/carousel-4-settings.jpg', alt: 'Voice settings sheet with the Shimmer voice and speed options', width: 375, height: 812 }] },
    end: [],
  },
  {
    slug: 'breeze-ai',
    tab: 'Breeze AI',
    tabShort: 'Breeze AI',
    name: 'BREEZE AI',
    homeName: 'HubSpot Breeze AI',
    year: '2026',
    homeDescription: 'HubSpot’s second brain for reps on the road who don’t have time for a traditional CRM.',
    headline: 'Breeze AI, HubSpot’s second brain for reps on the road',
    intro: 'When speed is key and sales reps are driving or rushing to the next meeting, they don’t have time to deep dive into their CRM. They need the answers straight away and in a concise format. This is where Breeze AI on mobile excels.',
    meta: [{ k: 'Company', v: 'HubSpot' }, { k: 'Project', v: 'Breeze AI' }, { k: 'Timeline', v: '6 months' }, { k: 'Role', v: 'Senior Product Designer' }],
    metrics: [
      { value: '48,120', label: 'Unique users, 9% of all mobile customers', chart: 'Grid of 100 dots with 9 lit: 9 percent of mobile customers use Breeze AI', viz: { kind: 'share', n: 9, total: 100, cols: 10, note: '9 in every 100 mobile customers' } },
      { value: '+50.29%', label: 'Week-on-week page view growth since August 2026', chart: 'Two dot bars: this week is 50 percent longer than last week, the growth shown in orange', viz: { kind: 'bars', rows: [{ label: 'Previous week', cols: 20 }, { label: 'This week · +50%', cols: 30, accent: 20 }] } },
      { value: '13.2k', label: 'Prompts submitted daily: 6.44k on iOS and 6.73k on Android', chart: 'Two dot stacks, each dot about 100 prompts: 64 for iOS and 67 for Android, nearly level', viz: { kind: 'pair', a: 64, b: 67, labelA: 'iOS · 6.44k', labelB: 'Android · 6.73k' } },
    ],
    sections: [
      {
        n: '01',
        title: 'The signal',
        blocks: [
          { type: 'p', text: 'CRM on mobile can be a daunting prospect, not only to design, but also for customers who hold vast amounts of data and perhaps not the greatest data cleanliness habits.' },
          { type: 'p', text: 'Once AI came on the scene, it became a huge opportunity for us to rethink the way customers interact with their mobile CRM. It opened the door to new paradigms of interaction, and to use cases where AI could foster better data capture, help our hardworking sales reps on the road get their work done faster, and deliver better outcomes for their sales pipeline.' },
        ],
        after: [],
      },
      {
        n: '02',
        title: 'The constraint',
        blocks: [
          { type: 'p', text: 'The constraint was twofold. We were at the forefront of what AI could do on top of a CRM, and as a company HubSpot was still figuring out how to deliver on customers’ expectations of a reliable, fast and interactive experience with their data. These were foundational tech issues that our teams leading the charge on AI products had to deal with.' },
          { type: 'callout', title: 'On the design side, this was a new modality for interacting with your CRM, a new way of working in HubSpot. Customers also came with expectations set by the frontier AI products already on the market, so Breeze AI had to match them and provide value, speed and trust.', items: [] },
          { type: 'p', text: 'We also had to figure out new interaction patterns across UI, speech to text and voice: ones that could make the product not only useful, but something customers came back to every day.' },
        ],
        after: [
          { kind: 'image', src: '/work/breeze-ai/component-library.jpg', alt: 'Breeze Assistant component library: header, loading states, agent invoke, chat input, artifacts, tasks, text bubbles, overflow menu, notifications, blockers and nudges', width: 1512, height: 1047, srcSet: '/work/breeze-ai/component-library-800.jpg 800w, /work/breeze-ai/component-library.jpg 1512w', caption: '[Breeze Assistant component library — the building blocks of chat on mobile]', frame: 'padded', bg: '#E8E4DB' },
          { kind: 'image', src: '/work/breeze-ai/early-to-layered.jpg', alt: 'Early beginnings to layered improvements: the first Breeze Assistant screens beside the refined greeting and chat', width: 1512, height: 982, srcSet: '/work/breeze-ai/early-to-layered-800.jpg 800w, /work/breeze-ai/early-to-layered.jpg 1512w', caption: '[From early beginnings to layered improvements]', bg: '#E8E4DB' },
        ],
      },
      {
        n: '03',
        title: 'The approach',
        blocks: [
          { type: 'p', text: 'Focusing in on the main customer journeys and problems to solve wasn’t a uniquely mobile task. We partnered closely with the web teams, using our pools of customers to discuss how they used other frontier AI applications, and which of their main HubSpot use cases could be augmented and improved with an LLM at the core.' },
          { type: 'p', text: 'This was an extended process. From a mobile design point of view, we started by creating the core structure of what Breeze AI would look like on mobile. Building key components, prototyping and testing became the norm each week, alongside iterative releases that customers could test with real data in their own portals.' },
          { type: 'p', text: 'So it wasn’t just prototypes. Customers were working with their own data and stress testing it in real life.' },
        ],
        after: [
          { kind: 'image', src: '/work/breeze-ai/agent-invocation.jpg', alt: 'Breeze Assistant handing a request to the Prospecting agent: prompt, agent invoke, reply and a Breeze needs your reply notification', width: 1512, height: 982, srcSet: '/work/breeze-ai/agent-invocation-800.jpg 800w, /work/breeze-ai/agent-invocation.jpg 1512w', caption: '[Agent invocation — Breeze handing a request to the Prospecting agent]', frame: 'padded', bg: '#E8E4DB' },
          { kind: 'image', src: '/work/breeze-ai/task-completion.jpg', alt: 'Working on a task with Breeze: to-do list, task attached to a prompt, thinking state and a drafted email artifact', width: 1512, height: 982, srcSet: '/work/breeze-ai/task-completion-800.jpg 800w, /work/breeze-ai/task-completion.jpg 1512w', caption: '[Automated task completion — Breeze working through a task and drafting the email]', frame: 'padded', bg: '#E8E4DB' },
        ],
      },
      {
        n: '04',
        title: 'Progression',
        blocks: [
          { type: 'p', text: 'As a team, and as an ethos at HubSpot, we’re constantly iterating and testing products with companies using live data, and we lean on our private beta group a lot.' },
          { type: 'p', text: 'Over time, Breeze AI on mobile has become the foundational piece that keeps us on par with web features and aligned with the market. Since launch, we’ve been layering more into the Breeze AI ecosystem on mobile:' },
          { type: 'list', items: ['Artifacts', 'Projects', 'Task completion via Breeze', 'Agent invocation from Breeze on mobile'] },
          { type: 'p', text: 'None of this would have been possible without the strong foundations we set.' },
        ],
        after: [
          { kind: 'image', src: '/work/breeze-ai/usage-chart.jpg', alt: 'Breeze on HubSpot mobile daily active users in 2026: pageviews climbing to 45.1k and messages sent to 17.9k', width: 2268, height: 1473, srcSet: '/work/breeze-ai/usage-chart-800.jpg 800w, /work/breeze-ai/usage-chart.jpg 2268w', caption: '[Breeze on HubSpot mobile — daily pageviews and messages sent through 2026]', frame: 'padded', bg: '#E8E4DB' },
        ],
      },
      {
        n: '05',
        title: 'The outcome',
        blocks: [
          { type: 'p', text: 'Breeze AI on mobile has come a long way since its early beginnings, with adoption climbing from April. We’ve layered in many features and unlocked new ways of working for reps on the road who need information from their CRM quickly.' },
          { type: 'p', text: 'We’ve had a couple of periods of strong growth, and we’re continuing to run growth experiments to improve adoption and retention, and to expose more users to Breeze. It currently reaches around 9% of our 300K+ mobile users.' },
          { type: 'p', text: 'So a lot done, but always more progress to make, and customers’ lives to make easier.' },
        ],
        after: [],
      },
    ],
    quote: '',
    quoteBy: '',
    stage: { kind: 'solo', screen: { kind: 'image', src: '/work/home/breeze-ai-phone.jpg', alt: 'Breeze Assistant: Hi Gavan, how can I help you? with suggested prompts and an Ask Breeze Assistant anything input', width: 750, height: 1624 } },
    hero: { kind: 'carousel', label: 'Breeze Assistant screens carousel', screens: [{ kind: 'image', src: '/work/breeze-ai/carousel-1-greeting.jpg', alt: 'Breeze Assistant greeting: Hi Gavan, how can I help you? with suggested prompts', width: 563, height: 1218 }, { kind: 'image', src: '/work/breeze-ai/carousel-2-menu.jpg', alt: 'Breeze Assistant overflow menu: New chat, Chats, Artifacts, Projects and Prompts', width: 563, height: 1215 }, { kind: 'image', src: '/work/breeze-ai/carousel-3-chats.jpg', alt: 'Chats list showing loading, selected, unread, scheduled and needs-reply thread states', width: 563, height: 1218 }, { kind: 'image', src: '/work/breeze-ai/carousel-4-agent-reply.jpg', alt: 'Breeze handing a request to the Prospecting agent and replying in the chat', width: 563, height: 1215 }] },
    afterMetrics: null,
    end: [],
  },
  {
    slug: 'mobile-crm',
    tab: 'Mobile CRM',
    tabShort: 'CRM',
    name: 'HUBSPOT MOBILE CRM',
    homeName: 'HubSpot Mobile CRM',
    year: '2024–26',
    homeDescription: 'Field reps were qualifying 3 leads a week on web. Here’s how we helped mobile reps double their lead qualification and capture crucial data.',
    headline: 'Their CRM lived on a desk. Their job didn’t.',
    intro: 'HubSpot’s field reps were closing deals on the road and logging them on a prayer. We fixed that, leads, calls, meetings, AI notes. All mobile. All in flow.',
    meta: [{ k: 'Company', v: 'HubSpot' }, { k: 'Project', v: 'Mobile Sales CRM' }, { k: 'Timeline', v: '10 months' }, { k: 'Role', v: 'Senior Product Designer' }],
    metrics: [
      { value: '+120%', label: 'More leads qualified per week: 7.2 on mobile vs. 3 on web', chart: 'Two dot bars: 3 leads qualified a week on web against 7.2 on mobile', viz: { kind: 'bars', rows: [{ label: 'Web · 3 a week', cols: 13 }, { label: 'Mobile · 7.2 a week', cols: 31, accent: 'last' }] } },
      { value: '13,071', label: 'Portals adopted mobile lead management in the first 3 months', chart: 'Grid of dots, 131 filled, each about 100 portals: 13,071 portals in three months', viz: { kind: 'waffle', n: 131, total: 160, note: 'Each dot ≈ 100 portals' } },
      { value: '45.7%', label: 'Of desktop lead users moved to mobile, without being pushed', chart: 'Dotted ring lit around 45.7 percent of its circumference', viz: { kind: 'ring', pct: 0.457 } },
    ],
    sections: [
      {
        n: '01',
        title: 'The signal',
        blocks: [
          { type: 'p', text: 'Field reps weren’t lazy. They were busy. A meeting ends, the next one starts, and nobody’s pulling out a laptop in a car park to update a CRM. Notes went unlogged. Leads went cold. Follow-ups got missed.' },
          { type: 'p', text: 'The data made it uncomfortable to ignore: reps using desktop tools were qualifying 3 leads a week. We knew mobile could do better. We just had to prove it.' },
        ],
        after: [],
      },
      {
        n: '02',
        title: 'The constraint',
        blocks: [
          { type: 'p', text: '300,000+ users across every market. A design system mid-migration. Four interconnected features that all had to ship without breaking the product people already relied on. And ambient AI audio capture with consent requirements that varied by country.' },
          { type: 'p', text: 'Not a greenfield project. Every call we made had blast radius.' },
        ],
        after: [],
      },
      {
        n: '03',
        title: 'The approach',
        blocks: [
          { type: 'p', text: 'We mapped the rep’s actual day, not the idealised version in a journey map, the real one. Commute, client site, car, back-to-back. Then we designed for the gaps in between.' },
          { type: 'p', text: 'Leads: a mobile-first view built around triage. Filter, score, act. No desktop detour required.' },
          { type: 'p', text: 'Inbound Calling: native call experience with post-call logging baked in. Hang up, log, move on. Thirty seconds.' },
          { type: 'p', text: 'In-Person Recorder: phone on the table, meeting running. One tap to capture. Designed to disappear.' },
          { type: 'p', text: 'AI Meeting Summary: by the time the rep’s back at the car, the notes are written, associated, and ready to review.' },
        ],
        after: [
          { kind: 'image', src: '/work/mobile-crm/calling-flow.jpg', alt: 'Calling on mobile: a Calls due today widget, an in-call screen and a call record with an AI call summary', width: 2268, height: 1473, srcSet: '/work/mobile-crm/calling-flow-800.jpg 800w, /work/mobile-crm/calling-flow.jpg 2268w', bg: '#E8E4DB' },
          { kind: 'image', src: '/work/mobile-crm/notetaker-flow.jpg', alt: 'Mobile Notetaker: entry point on the Sales home, recording in progress and saved recordings ready to associate', width: 2268, height: 1473, srcSet: '/work/mobile-crm/notetaker-flow-800.jpg 800w, /work/mobile-crm/notetaker-flow.jpg 2268w', bg: '#E8E4DB' },
        ],
      },
      {
        n: '04',
        title: 'The outcome',
        blocks: [
          { type: 'p', text: '13,071 portals adopted mobile lead management in the first 3 months. 45.7% of desktop lead users moved to mobile, without being pushed. +120% more leads qualified per week: 7.2 on mobile vs. 3 on web.' },
        ],
        after: [
          { kind: 'image', src: '/work/mobile-crm/leads-qualified-chart.jpg', alt: 'Median leads qualified per month in Sales Hub Pro+ portals: portals using mobile lead management sit at 4 to 7, against 2 to 3 without it', width: 2268, height: 1329, srcSet: '/work/mobile-crm/leads-qualified-chart-800.jpg 800w, /work/mobile-crm/leads-qualified-chart.jpg 2268w', bg: '#F9F4EE' },
          { kind: 'image', src: '/work/mobile-crm/reaction-unbound.jpg', alt: 'Reaction to the Mobile Notetaker: a Slack shout-out, the Unbound 2026 keynote stage and a LinkedIn post from a HubSpot partner', width: 2268, height: 1473, srcSet: '/work/mobile-crm/reaction-unbound-800.jpg 800w, /work/mobile-crm/reaction-unbound.jpg 2268w', caption: '[Getting a shout-out from Duncan, our CEO, at Unbound]', bg: '#E8E4DB' },
        ],
      },
      {
        n: '05',
        title: 'Design system',
        blocks: [
          { type: 'p', text: 'Over my two years working on mobile, we’ve gone through three design system iterations. The latest was a total revamp of HubSpot’s design system language into a semantic token system.' },
          { type: 'p', text: 'As the sole designer on mobile for most of this year and late last year, I ran the replatforming of our design token color system, our font scaling and all our native components to match the new design system set out by HubSpot’s core team.' },
          { type: 'p', text: 'Below you can see the progression from the early days in 2023 to today in 2026.' },
        ],
        after: [
          { kind: 'image', src: '/work/mobile-crm/design-tokens.jpg', alt: 'Mobile design tokens system in Figma, with header, navigation, button, input and native Android and iOS component libraries', width: 2268, height: 1635, srcSet: '/work/mobile-crm/design-tokens-800.jpg 800w, /work/mobile-crm/design-tokens.jpg 2268w', caption: '[Design system — semantic token setup]', frame: 'padded', bg: '#E8E4DB' },
          { kind: 'image', src: '/work/mobile-crm/sales-home-evolution.jpg', alt: 'The HubSpot mobile Sales home evolving across three versions, ending with a Breeze-powered suggested actions view', width: 2268, height: 1473, srcSet: '/work/mobile-crm/sales-home-evolution-800.jpg 800w, /work/mobile-crm/sales-home-evolution.jpg 2268w', caption: '[Progression over three global system token updates]', frame: 'padded', bg: '#E8E4DB' },
        ],
      },
    ],
    quote: '“Prospecting on mobile was the missing piece for our team on the road.”',
    quoteBy: 'Jay, HubSpot Evangelist, USA',
    stage: { kind: 'pair', screens: [{ kind: 'image', src: '/work/home/mobile-crm-phone-back.jpg', alt: 'HubSpot mobile welcome screen: Making Productivity Easier, with Login and Sign Up', width: 563, height: 1218 }, { kind: 'image', src: '/work/home/mobile-crm-phone-front.jpg', alt: 'Mobile Notetaker recording a meeting at 00:23:12, with Delete, Pause and Finish', width: 563, height: 1218 }] },
    hero: { kind: 'image', src: '/work/mobile-crm/hero-sales-leads-record.jpg', alt: 'Mobile Sales home, Leads pipeline board and a lead record with an AI lead summary', width: 2268, height: 1473, srcSet: '/work/mobile-crm/hero-sales-leads-record-800.jpg 800w, /work/mobile-crm/hero-sales-leads-record.jpg 2268w', bg: '#E8E4DB' },
    afterMetrics: null,
    end: [],
  },
  {
    slug: 'gym-crm',
    tab: 'Gym CRM',
    tabShort: 'Gym CRM',
    name: 'GLOFOX AMPLIFY',
    homeName: 'Glofox Amplify',
    year: '2023',
    homeDescription: 'Gym owners were losing leads while on the gym floor. Amplify turned them into paying customers at 2.5x the rate with automated, personalised outreach. Crushing it!',
    headline: 'They paid to get the lead. Then let it go cold.',
    intro: 'Glofox had thousands of gym owners generating leads and losing them in the follow-up gap. Amplify was the fix, their first automated communication tool, designed from scratch.',
    meta: [{ k: 'Company', v: 'Glofox' }, { k: 'Project', v: 'Amplify — Gym Management CRM' }, { k: 'Timeline', v: '6 months' }, { k: 'Role', v: 'Senior Product Designer' }],
    metrics: [
      { value: '2.7×', label: 'More leads converted for studios using Amplify (BikeRowSki pilot, 5 locations, 6 months)', chart: 'Two dotted discs: the one for studios using Amplify holds 2.7 times the area, the extra shown in orange', viz: { kind: 'discs', k: 2.7, labelA: 'Without · 1×', labelB: 'With Amplify · 2.7×' } },
      { value: '+24%', label: 'Higher lead conversion vs. studios not using the tool', chart: 'Two dot bars: lead conversion 24 percent higher with the tool, the extra shown in orange', viz: { kind: 'bars', rows: [{ label: 'Without the tool', cols: 25 }, { label: 'With the tool · +24%', cols: 31, accent: 25 }] } },
      { value: '8,471', label: 'Hours saved across the operator base, at an average of 3 minutes per message', chart: 'Grid of dots, 169 filled, each about 50 hours: 8,471 hours saved', viz: { kind: 'waffle', n: 169, total: 180, note: 'Each dot ≈ 50 hours' } },
    ],
    sections: [
      {
        n: '01',
        title: 'The signal',
        blocks: [
          { type: 'p', text: 'A new lead signs up online. The gym owner is mid-class. By the time they surface, it’s been 6 hours. The lead’s moved on.' },
          { type: 'p', text: 'This was happening everywhere across the Glofox customer base. Not because operators didn’t care, because they were running a physical business with two hands and not enough hours. Every unanswered lead was revenue walking out the door.' },
        ],
        after: [],
      },
      {
        n: '02',
        title: 'The constraint',
        blocks: [
          { type: 'p', text: 'The users weren’t marketers. They were personal trainers who’d started a business. Automation tools built for SaaS teams would’ve terrified them. Whatever we built had to feel like a simple list of things going out, not a workflow engine.' },
          { type: 'p', text: 'And it had to prove revenue impact fast. First product of its kind at Glofox. No second chances if it flopped.' },
        ],
        after: [
          { kind: 'image', src: '/work/gym-crm/workflow-branching.jpg', alt: 'Amplify workflow with a trial rule branching to true and false paths, beside a per-message conversion table', width: 1853, height: 886, srcSet: '/work/gym-crm/workflow-branching-800.jpg 800w, /work/gym-crm/workflow-branching.jpg 1853w', bg: '#E5E5E5' },
          { kind: 'image', src: '/work/gym-crm/insights-dashboard.jpg', alt: 'Amplify Insights tab: leads contacted, conversion rate, messages sent and a workflow message breakdown chart', width: 1853, height: 886, srcSet: '/work/gym-crm/insights-dashboard-800.jpg 800w, /work/gym-crm/insights-dashboard.jpg 1853w', bg: '#E5E5E5' },
        ],
      },
      {
        n: '03',
        title: 'The approach',
        blocks: [
          { type: 'p', text: 'We ran discovery research with studio owners to find the shape of the problem. The answer was always the same: the first 48 hours. Lead goes cold, it stays cold.' },
          { type: 'p', text: 'Built a sequence builder around that insight, trigger-based, timed, dead simple. A lead enters the system and a chain of emails and texts goes out automatically. No jargon, no decision trees, no configuration paralysis.' },
          { type: 'p', text: 'Designed the Insights tab alongside it so owners could see exactly what was going out, when, and whether it was working. Numbers they could act on. Not charts they’d ignore.' },
        ],
        after: [],
      },
      {
        n: '04',
        title: 'The outcome',
        blocks: [
          { type: 'p', text: '2.7x more leads converted for studios using Amplify (BikeRowSki pilot, 5 locations, 6 months). +24% higher lead conversion vs. studios not using the tool. 8,471 hours saved, at an average of 3 minutes per message, across the operator base.' },
        ],
        after: [],
      },
    ],
    quote: '“With Amplify I know my messages are going out 100% of the time, while I focus on other areas of my business.”',
    quoteBy: 'James, Founder, BeatBox Boxing',
    stage: { kind: 'monitor', screen: { kind: 'image', src: '/work/home/gym-crm-monitor-screen.jpg', alt: 'Glofox Gym Insights snapshot: sales, leads, members and retention, today in the studio, classes and trainers', width: 941, height: 588 } },
    hero: { kind: 'image', src: '/work/gym-crm/hero-workflow-builder.jpg', alt: 'Amplify workflow builder: a New leads sequence of timed emails and SMS, with the email editor open', width: 1853, height: 886, srcSet: '/work/gym-crm/hero-workflow-builder-800.jpg 800w, /work/gym-crm/hero-workflow-builder.jpg 1853w', bg: '#E5E5E5' },
    afterMetrics: null,
    end: [
      { kind: 'image', src: '/work/gym-crm/gym-insights-snapshot.jpg', alt: 'Gym Insights snapshot: sales, leads, members and retention, today in the studio, classes and trainers', width: 1853, height: 886, srcSet: '/work/gym-crm/gym-insights-snapshot-800.jpg 800w, /work/gym-crm/gym-insights-snapshot.jpg 1853w', bg: '#E5E5E5' },
      { kind: 'image', src: '/work/gym-crm/mobile-insights.jpg', alt: 'Glofox mobile insights: sales over time, attendance check-ins and member breakdown', width: 1853, height: 886, srcSet: '/work/gym-crm/mobile-insights-800.jpg 800w, /work/gym-crm/mobile-insights.jpg 1853w', bg: '#E5E5E5' },
      { kind: 'image', src: '/work/gym-crm/insight-cards.jpg', alt: 'Gym insights cards: gender split, visits, gross and net sales, and sales by stream type', width: 960, height: 886, bg: '#E5E5E5' },
      { kind: 'image', src: '/work/gym-crm/bookings-chart.jpg', alt: 'Bookings and appointments by hour, 402 in total, averaging 22 an hour', width: 960, height: 412, bg: '#E5E5E5' },
      { kind: 'image', src: '/work/gym-crm/amplify-marketing-page.jpg', alt: 'Glofox Amplify marketing page: streamline your customer communications with easy-to-use automations', width: 960, height: 412, bg: '#E5E5E5' },
    ],
  },
]

export const ABOUT_INDEX = 0

export function projectIndexBySlug(slug: string): number {
  return projects.findIndex((p) => p.slug === slug)
}
