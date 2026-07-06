export type Work = {
  slug: string
  company: string
  title: string
  description: string
  accent: string
}

const SHARED_DESC = 'I like getting close to the product itself, turning ideas into working things'

export const works: Work[] = [
  {
    slug: 'hubspot-crm',
    company: 'HubSpot',
    title: "HUBSPOT. THEIR CRM LIVED ON A DESK. THEIR JOB DIDN'T.",
    description: SHARED_DESC,
    accent: '#5b1a3a',
  },
  {
    slug: 'glofox',
    company: 'Glofox',
    title: 'GLOFOX. LOSING LEADS WHILE TEACHING SPIN.',
    description: SHARED_DESC,
    accent: '#2a1454',
  },
  {
    slug: 'movember',
    company: 'Movember',
    title: 'MOVEMBER. ONE CAMPAIGN. ONE MONTH. EVERY 1% WAS WORTH A MILLION DOLLARS.',
    description: SHARED_DESC,
    accent: '#1d3a2f',
  },
  {
    slug: 'sportsbet',
    company: 'Sportsbet',
    title: 'SPORTSBET. A BET PLACED IN SECONDS, NOT SCREENS.',
    description: SHARED_DESC,
    accent: '#3a1d14',
  },
  {
    slug: 'paddy-power',
    company: 'Paddy Power',
    title: 'PADDY POWER. RICH FEATURES, SHARP EDGES. SO WE FILED THEM DOWN.',
    description: SHARED_DESC,
    accent: '#14323a',
  },
  {
    slug: 'hubspot-console',
    company: 'HubSpot',
    title: 'HUBSPOT. TURNING A CONSOLE INTO A CONVERSATION.',
    description: SHARED_DESC,
    accent: '#3a2614',
  },
]

export type JourneyRow = {
  company: string
  role: string
  location: string
  period: string
}

export const journey: JourneyRow[] = [
  { company: 'HubSpot', role: 'Senior Product Designer', location: 'IRE', period: '2023 — Present' },
  { company: 'Glofox', role: 'Senior Product Designer', location: 'REM', period: '2021 — 2023' },
  { company: 'Movember', role: 'Lead Product Designer', location: 'AUS', period: '2017 — 2021' },
  { company: 'Sportsbet', role: 'Senior Product Designer', location: 'AUS', period: '2016 — 2017' },
  { company: 'Paddy Power', role: 'UX Architect', location: 'IRE', period: '2015 — 2016' },
]

export type ArchiveItem = {
  title: string
  year: string
  role: string
  tag: string
}

export const archive: ArchiveItem[] = [
  { title: 'MOVEMBER', year: '2024', role: 'Senior Designer', tag: 'MOBILE' },
  { title: 'GLOFOX', year: '2023', role: 'Senior Designer', tag: 'MOBILE' },
  { title: 'HUBSPOT', year: '2023', role: 'Senior Designer', tag: 'WEB' },
  { title: 'SPORTSBET', year: '2017', role: 'Senior Designer', tag: 'MOBILE' },
  { title: 'PADDY POWER', year: '2016', role: 'UX Architect', tag: 'WEB' },
]

/* ---------- Project detail pages ---------- */

export type ApproachItem = { label: string; text: string }
export type OutcomeStat = { value: string; text: string }
export type ProjectMeta = { year: string; industry: string; platform: string; timeline: string }
export type ProjectContent = {
  slug: string
  company: string
  meta: ProjectMeta
  headline: string
  subheadline: string
  signal: string[]
  constraint: string[]
  approachIntro: string[]
  approachItems: ApproachItem[]
  outcomeStats: OutcomeStat[]
  outcomeIntro?: string[]
  quote?: { text: string; author: string }
  pageImages?: string[]
  preApproachMedia?: string
  preOutcomeMedia?: string
}

export const projectContent: Record<string, ProjectContent> = {
  'hubspot-console': {
    slug: 'hubspot-console',
    company: 'HubSpot: Breeze AI Console',
    meta: { year: '2024', industry: 'Sales CRM', platform: 'Mobile', timeline: '8 months' },
    headline: 'How mobile data capture became a Breeze.',
    subheadline:
      "HubSpot's CRM is record-centric. Sound principle for a desk. Wrong one for a rep with thirty seconds before a meeting starts.",
    signal: [
      "HubSpot's CRM is record-centric: every action has to be anchored to a contact, a meeting, an engagement. Sound principle for a desk. Wrong one for a rep with thirty seconds before a meeting starts. The existing flow made them find or create a contact, book or log a meeting, then navigate into it just to tap \"start recording.\"",
      '!! Over 10k weekly active users were manually logging around 85k post meeting activities on the app in a single month. Eight times more than booked meetings.',
      'Most field meetings aren\'t planned, they\'re ad hoc. 53% started from a company record, not a contact, because the meeting hadn\'t been pre-staged at all. Reps said it plainly: they expected a record button on the main screen, not buried behind a meeting they hadn\'t created yet. And once a meeting ended, the recording became a black box. No replay, no transcript, nothing to check.',
    ],
    constraint: [
      '!! Decoupling recording from CRM association meant rethinking a core piece of HubSpot\'s data model.',
      'Every engagement had always required an anchor. We needed a path where a recording could exist first and get attached later, without becoming an orphaned file nobody ever filed away.',
    ],
    approachIntro: [
      'Started from the rep\'s real moment of need: meeting\'s starting, no time, no CRM lookup. Designed a path to recording that requires zero pre-existing engagement. Tap once, capture starts immediately. CRM association happens after.',
      '!! That single change collapsed three steps into one motion.',
      'For the second half, we built mobile recording playback to match desktop: full audio and video replay attached to the meeting, with a transcript that\'s speaker-diarised and scrolls in sync. Layered Breeze Assistant search on top so reps can pull a specific moment without scrubbing through a 40-minute recording.',
    ],
    approachItems: [],
    outcomeIntro: [
      'Reduced meeting capture from a 3-step CRM-first flow to a single tap, matching the speed of the moment it\'s meant to serve. Built recording replay and synced transcript search where none existed on mobile.',
      '!! Positioned the feature to compete directly against frictionless capture tools like Granola, on HubSpot\'s own CRM-connected terms.',
    ],
    outcomeStats: [
      { value: 'Results Coming Soon', text: 'Features currently in rollout' },
    ],
    quote: {
      text: "Kinda hard to find in the iOS app. I kind of expected a \"record in-person meeting\" on the main page, and then able to save that to a meeting.",
      author: 'Scott, Beta Tester, USA',
    },
    pageImages: [
      '/images/hubspot-console/page/1.jpg',
      '/images/hubspot-console/page/2.jpg',
      '/images/hubspot-console/page/3.jpg',
      '/images/hubspot-console/page/4.jpg',
      '/images/hubspot-console/page/5.jpg',
      '/images/hubspot-console/page/6.jpg',
      '/images/hubspot-console/page/7.jpg',
      '/images/hubspot-console/page/8.jpg',
    ],
    preApproachMedia: '/images/hubspot-console/page/mobilenotetaker.webm',
  },

  'hubspot-crm': {
    slug: 'hubspot-crm',
    company: 'HubSpot: Mobile Sales CRM',
    meta: { year: '2024', industry: 'Sales CRM', platform: 'Mobile', timeline: '6 months' },
    headline: "Their CRM lived on a desk. Their job didn't.",
    subheadline:
      "HubSpot's field reps were closing deals on the road and logging them on a prayer. We fixed that. Leads, calls, meetings, AI notes. All mobile. All in flow.",
    signal: [
      "Field reps weren't lazy. They were busy. A meeting ends, the next one starts, and nobody's pulling out a laptop in a car park to update a CRM. Notes went unlogged. Leads went cold. Follow-ups got missed.",
      '!! The data made it uncomfortable to ignore: reps using desktop tools were qualifying 3 leads a week. We knew mobile could do better. We just had to prove it.',
    ],
    constraint: [
      '300,000+ users across every market. A design system mid-migration. Four interconnected features that all had to ship without breaking the product people already relied on. And ambient AI audio capture with consent requirements that varied by country.',
      '!! Not a greenfield project. Every call we made had blast radius.',
    ],
    approachIntro: [
      "We mapped the rep's actual day, not the idealised version in a journey map, the real one. Commute, client site, car, back-to-back. Then we designed for the gaps in between.",
    ],
    approachItems: [
      { label: 'Leads', text: 'a mobile-first view built around triage. Filter, score, act. No desktop detour required.' },
      { label: 'Inbound Calling', text: 'native call experience with post-call logging baked in. Hang up, log, move on. Thirty seconds.' },
      { label: 'In-Person Recorder', text: 'phone on the table, meeting running. One tap to capture. Designed to disappear.' },
      { label: 'AI Meeting Summary', text: "by the time the rep's back at the car, the notes are written, associated, and ready to review." },
    ],
    outcomeIntro: ['!! 13,071 portals adopted mobile lead management in the first 3 months. 45.7% of desktop lead users moved to mobile, without being pushed.'],
    outcomeStats: [
      { value: '13,071', text: 'portals adopted mobile lead management in the first 3 months' },
      { value: '45.7%', text: 'of desktop lead users moved to mobile, without being pushed' },
      { value: '+120%', text: 'more leads qualified per week. 7.2 on mobile vs. 3 on web' },
    ],
    quote: {
      text: 'Prospecting on mobile was the missing piece for our team on the road.',
      author: 'Jay, HubSpot Evangelist, USA',
    },
    pageImages: [
      '/images/hubspot-crm/page/1.jpg',
      '/images/hubspot-crm/page/2.jpg',
      '/images/hubspot-crm/page/3.jpg',
      '/images/hubspot-crm/page/4.jpg',
      '/images/hubspot-crm/page/5.jpg',
      '/images/hubspot-crm/page/6.jpg',
      '/images/hubspot-crm/page/7.jpg',
      '/images/hubspot-crm/page/8.jpg',
    ],
    preOutcomeMedia: '/images/hubspot-crm/page/9.jpg',
  },

  glofox: {
    slug: 'glofox',
    company: 'Glofox: Gym Management CRM',
    meta: { year: '2022', industry: 'Gym Management', platform: 'Mobile · Web', timeline: '12 weeks' },
    headline: 'They paid to get the lead. Then let it go cold.',
    subheadline:
      'Glofox had thousands of gym owners generating leads and losing them in the follow-up gap. Amplify was the fix. Their first automated communication tool, designed from scratch.',
    signal: [
      "!! A new lead signs up online. The gym owner is mid-class. By the time they surface, it's been 6 hours. The lead's moved on.",
      "This was happening everywhere across the Glofox customer base. Not because operators didn't care, because they were running a physical business with two hands and not enough hours. Every unanswered lead was revenue walking out the door.",
    ],
    constraint: [
      "The users weren't marketers. They were personal trainers who'd started a business. Automation tools built for SaaS teams would've terrified them. Whatever we built had to feel like a simple list of things going out, not a workflow engine.",
      "!! And it had to prove revenue impact fast. First product of its kind at Glofox. No second chances if it flopped.",
    ],
    approachIntro: [
      'Ran discovery across studio owners to find the shape of the problem. The answer was always the same: the first 48 hours. Lead goes cold, it stays cold.',
      '!! Built a sequence builder around that insight, trigger-based, timed, dead simple. A lead enters the system and a chain of emails and texts goes out automatically. No jargon, no decision trees, no configuration paralysis.',
      "Designed the Insights tab alongside it so owners could see exactly what was going out, when, and whether it was working. Numbers they could act on. Not charts they'd ignore.",
    ],
    approachItems: [],
    outcomeIntro: ['!! 2.7x more leads converted. 8,471 hours saved across the operator base.'],
    outcomeStats: [
      { value: '2.7x', text: 'more leads converted for studios using Amplify (BikeRowSki pilot, 5 locations, 6 months)' },
      { value: '+24%', text: 'higher lead conversion vs. studios not using the tool' },
      { value: '8,471 hrs', text: 'saved, averaging 3 minutes per message across the operator base' },
    ],
    quote: {
      text: 'With Amplify I know my messages are going out 100% of the time, while I focus on other areas of my business.',
      author: 'James, Founder, BeatBox Boxing',
    },
    pageImages: [
      '/images/glofox/page/1.jpg',
      '/images/glofox/page/2.jpg',
      '/images/glofox/page/3.jpg',
      '/images/glofox/page/4.jpg',
      '/images/glofox/page/5.jpg',
      '/images/glofox/page/6.jpg',
      '/images/glofox/page/7.jpg',
      '/images/glofox/page/8.jpg',
    ],
  },

  movember: {
    slug: 'movember',
    company: 'Movember: Fundraising Platform',
    meta: { year: '2020', industry: 'Non-profit', platform: 'Web · Mobile', timeline: '2021' },
    headline: '1% = $1,000,000. So we sweated every pixel.',
    subheadline:
      'Four years improving the Movember fundraising platform. Sign-up conversion, fundraiser retention, and the moments in between that made people come back year after year.',
    signal: [
      "Movember raises around $100 million a year. It runs on a single month-long campaign. There's no second window, no Q4 push, no recovery quarter. You get November.",
      "!! In that context, a 1% improvement in sign-up conversion isn't a nice metric to put in a slide, it's a million dollars for men's health research. That's the weight every design decision carried.",
    ],
    constraint: [
      "One shot per year. No mid-campaign iteration. The product had to be right before it went live, because fixing it in November wasn't an option.",
      'Add to that: a global fundraiser base spanning corporate teams, event hosts, solo participants, returners, and first-timers, all needing a sign-up experience that felt personal without being slow. And a cross-functional environment where product, marketing, data, and charity ops all had a stake in the outcome.',
      '!! Alignment was as much the work as the design.',
    ],
    approachIntro: [
      'Built the first shared fundraiser experience map across departments, one view of the entire journey from first click to post-campaign reactivation, segmented by fundraiser type and propensity to return.',
      '!! It sounds like a workshop output. It became the product strategy.',
      "Used it to find the drop-off points that mattered most and designed directly at them: tightening the sign-up flow, sharpening the moment-of-commitment messaging, and running re-engagement sequences at lapsed fundraisers who'd raised before but hadn't returned.",
      'Iterated campaign by campaign. Slow, compounding, deliberate.',
    ],
    approachItems: [],
    outcomeIntro: ['!! +6% sign-up conversion, improved consistently across 3 campaigns. Each point worth approximately $1 million in additional funds raised.'],
    pageImages: [
      '/images/movember/page/1.jpg',
      '/images/movember/page/2.jpg',
      '/images/movember/page/3.jpg',
      '/images/movember/page/4.jpg',
      '/images/movember/page/5.jpg',
      '/images/movember/page/6.jpg',
      '/images/movember/page/7.jpg',
      '/images/movember/page/8.jpg',
    ],
    outcomeStats: [
      { value: '+6%', text: 'sign-up conversion rate, improved consistently across 3 campaigns' },
      { value: '~$1M', text: 'each point of that improvement worth roughly $1 million in additional funds raised' },
      { value: 'Adopted', text: 'the experience map became the standard planning tool for campaign strategy across departments' },
    ],
  },
}

export function getProject(slug: string): ProjectContent | undefined {
  return projectContent[slug]
}
