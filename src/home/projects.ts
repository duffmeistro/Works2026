export type Device = 'phones' | 'monitor' | 'none'

export type MetaItem = { k: string; v: string }
export type Metric = { v: string; l: string }
export type Paragraph = { t: string }
export type Section = { n: string; t: string; paras: Paragraph[] }

export type Project = {
  slug: string
  name: string
  shortLabel: string
  tab: string
  tabM: string
  company: string
  year: string
  accent: string
  bg: string
  desc: string
  headline: string
  sub: string
  meta: MetaItem[]
  metrics: Metric[]
  sections: Section[]
  quote: string
  quoteBy: string
  device: Device
  screens: string[]
}

export const projects: Project[] = [
  {
    slug: 'about',
    name: "ABOUT",
    tab: "About",
    tabM: "About",
    company: "Gavan Duffy",
    year: "2026",
    accent: "#3A3A3A",
    bg: "#E8E4DC",
    desc: "I’m a senior product designer with 10+ years in tech, now at HubSpot, designing AI-assisted tools for sales and productivity. My work spans mobile CRM, meeting capture and growth, and I build the prototypes myself.",
    headline: "Hey, I’m Gav.",
    sub: "I’m a senior product designer with 10+ years in tech, now at HubSpot, designing AI-assisted tools for sales and productivity. My work spans mobile CRM, meeting capture and growth, and I build the prototypes myself.",
    meta: [
      {
        k: "Role",
        v: "Senior Product Designer"
      },
      {
        k: "Now",
        v: "HubSpot"
      },
      {
        k: "Experience",
        v: "10+ years in tech"
      },
      {
        k: "Based",
        v: "Ireland"
      }
    ],
    metrics: [],
    sections: [
      {
        n: "01",
        t: "How I work",
        paras: [
          {
            t: "I get a lot of energy figuring out tricky problems, always looking for the simplest, cleanest outcome. Currently digging idea tennis with AI."
          }
        ]
      },
      {
        n: "02",
        t: "Everyday tools",
        paras: [
          {
            t: "Claude, Conductor, NotebookLM, Amplitude and Loom. I may never type again."
          }
        ]
      }
    ],
    quote: "",
    quoteBy: "",
    shortLabel: 'about',
    device: 'none',
    screens: []
  },
  {
    slug: "notetaker",
    name: "HUBSPOT NOTETAKER",
    tab: "Notetaker",
    tabM: "Notes",
    company: "HubSpot",
    year: "2026",
    accent: "#E7A33E",
    bg: "#F8EDDB",
    desc: "Unstructured field data, turned into something HubSpot mobile users could leverage. AI call logging, meeting capture, and Breeze AI all built into mobile, with you on the move.",
    headline: "The meeting started. The CRM wasn’t ready. Neither was the rep.",
    sub: "HubSpot’s in-person recorder required three steps of CRM setup before a rep could capture a single word. We rebuilt it around the reality of field sales: meetings happen first, admin happens later.",
    meta: [
      {
        k: "Company",
        v: "HubSpot"
      },
      {
        k: "Project",
        v: "One-Tap Notetaker & Meeting Recap"
      },
      {
        k: "Year",
        v: "2026"
      },
      {
        k: "Role",
        v: "[Your role]"
      }
    ],
    metrics: [
      {
        v: "3 → 1",
        l: "Steps to start recording a meeting, from a CRM-first flow to a single tap"
      },
      {
        v: "85.6k",
        l: "Post-meetings logged via Log Activity in a single month, eight times more than booked meetings"
      },
      {
        v: "53%",
        l: "Of meetings started from a company record, not a contact"
      }
    ],
    sections: [
      {
        n: "01",
        t: "The signal",
        paras: [
          {
            t: "HubSpot’s CRM is record-centric: every action has to be anchored to a contact, a meeting, an engagement. Sound principle for a desk. Wrong one for a rep with thirty seconds before a meeting starts. The existing flow made them find or create a contact, book or log a meeting, then navigate into it just to tap “start recording.”"
          },
          {
            t: "The data backed it up. 10.1k weekly users were logging 85.6k post-meetings via Log Activity in a single month, eight times more than booked meetings. Most field meetings aren’t planned, they’re ad hoc. 53% started from a company record, not a contact, because the meeting hadn’t been pre-staged at all."
          },
          {
            t: "Reps said it plainly: they expected a record button on the main screen, not buried behind a meeting they hadn’t created yet. And once a meeting ended, the recording became a black box, no replay, no transcript, nothing to check if a rep needed to verify a commitment later."
          }
        ]
      },
      {
        n: "02",
        t: "The constraint",
        paras: [
          {
            t: "Decoupling recording from CRM association meant rethinking a core piece of HubSpot’s data model, every engagement had always required an anchor. We needed a path where a recording could exist first and get attached later, without becoming an orphaned file nobody ever filed away."
          }
        ]
      },
      {
        n: "03",
        t: "The approach",
        paras: [
          {
            t: "Started from the rep’s real moment of need: meeting’s starting, no time, no CRM lookup. Designed a path to recording that requires zero pre-existing engagement, tap once, capture starts immediately, CRM association happens after. That single change collapsed three steps into one motion."
          },
          {
            t: "For the second half, we built mobile recording playback to match desktop: full audio and video replay attached to the meeting, with a transcript that’s speaker-diarised and scrolls in sync. Layered Breeze Assistant search on top so reps can pull a specific moment without scrubbing through a 40-minute recording."
          }
        ]
      },
      {
        n: "04",
        t: "The outcome",
        paras: [
          {
            t: "Reduced meeting capture from a 3-step CRM-first flow to a single tap, matching the speed of the moment it’s meant to serve. Built recording replay and synced transcript search where none existed on mobile, closing the gap between desktop and field capability. Positioned the feature to compete directly against frictionless capture tools like Granola, on HubSpot’s own CRM-connected terms."
          }
        ]
      }
    ],
    quote: "",
    quoteBy: "",
    shortLabel: "recap",
    device: 'phones',
    screens: [
      "/work/notetaker/voice-ready.png",
      "/work/notetaker/voice-conversation.png"
    ]
  },
  {
    slug: "mobile-crm",
    name: "HUBSPOT MOBILE CRM",
    tab: "Mobile CRM",
    tabM: "CRM",
    company: "HubSpot",
    year: "2026",
    accent: "#1E7B5C",
    bg: "#DFEDE6",
    desc: "Field reps were qualifying 3 leads a week on web. How mobile pushed that to 7. Doubling their lead qualification.",
    headline: "Their CRM lived on a desk. Their job didn’t.",
    sub: "HubSpot’s field reps were closing deals on the road and logging them on a prayer. We fixed that, leads, calls, meetings, AI notes. All mobile. All in flow.",
    meta: [
      {
        k: "Company",
        v: "HubSpot"
      },
      {
        k: "Project",
        v: "Mobile Sales CRM"
      },
      {
        k: "Year",
        v: "2026"
      },
      {
        k: "Role",
        v: "[Your role]"
      }
    ],
    metrics: [
      {
        v: "+120%",
        l: "More leads qualified per week: 7.2 on mobile vs. 3 on web"
      },
      {
        v: "13,071",
        l: "Portals adopted mobile lead management in the first 3 months"
      },
      {
        v: "45.7%",
        l: "Of desktop lead users moved to mobile, without being pushed"
      }
    ],
    sections: [
      {
        n: "01",
        t: "The signal",
        paras: [
          {
            t: "Field reps weren’t lazy. They were busy. A meeting ends, the next one starts, and nobody’s pulling out a laptop in a car park to update a CRM. Notes went unlogged. Leads went cold. Follow-ups got missed."
          },
          {
            t: "The data made it uncomfortable to ignore: reps using desktop tools were qualifying 3 leads a week. We knew mobile could do better. We just had to prove it."
          }
        ]
      },
      {
        n: "02",
        t: "The constraint",
        paras: [
          {
            t: "300,000+ users across every market. A design system mid-migration. Four interconnected features that all had to ship without breaking the product people already relied on. And ambient AI audio capture with consent requirements that varied by country."
          },
          {
            t: "Not a greenfield project. Every call we made had blast radius."
          }
        ]
      },
      {
        n: "03",
        t: "The approach",
        paras: [
          {
            t: "We mapped the rep’s actual day, not the idealised version in a journey map, the real one. Commute, client site, car, back-to-back. Then we designed for the gaps in between."
          },
          {
            t: "Leads: a mobile-first view built around triage. Filter, score, act. No desktop detour required."
          },
          {
            t: "Inbound Calling: native call experience with post-call logging baked in. Hang up, log, move on. Thirty seconds."
          },
          {
            t: "In-Person Recorder: phone on the table, meeting running. One tap to capture. Designed to disappear."
          },
          {
            t: "AI Meeting Summary: by the time the rep’s back at the car, the notes are written, associated, and ready to review."
          }
        ]
      },
      {
        n: "04",
        t: "The outcome",
        paras: [
          {
            t: "13,071 portals adopted mobile lead management in the first 3 months. 45.7% of desktop lead users moved to mobile, without being pushed. +120% more leads qualified per week: 7.2 on mobile vs. 3 on web."
          }
        ]
      }
    ],
    quote: "“Prospecting on mobile was the missing piece for our team on the road.”",
    quoteBy: "Jay, HubSpot Evangelist, USA",
    shortLabel: "sales crm",
    device: 'phones',
    screens: []
  },
  {
    slug: "glofox-amplify",
    name: "GLOFOX AMPLIFY",
    tab: "Glofox",
    tabM: "Glofox",
    company: "Glofox",
    year: "2026",
    accent: "#8B5CF6",
    bg: "#ECE5FB",
    desc: "Gym owners were losing leads while on the gym floor. Amplify turned them into paying customers at 2.5x the rate with automated, personalised outreach. Crushing it!",
    headline: "They paid to get the lead. Then let it go cold.",
    sub: "Glofox had thousands of gym owners generating leads and losing them in the follow-up gap. Amplify was the fix, their first automated communication tool, designed from scratch.",
    meta: [
      {
        k: "Company",
        v: "Glofox"
      },
      {
        k: "Project",
        v: "Amplify — Gym Management CRM"
      },
      {
        k: "Year",
        v: "2026"
      },
      {
        k: "Role",
        v: "[Your role]"
      }
    ],
    metrics: [
      {
        v: "2.7×",
        l: "More leads converted for studios using Amplify (BikeRowSki pilot, 5 locations, 6 months)"
      },
      {
        v: "+24%",
        l: "Higher lead conversion vs. studios not using the tool"
      },
      {
        v: "8,471",
        l: "Hours saved across the operator base, at an average of 3 minutes per message"
      }
    ],
    sections: [
      {
        n: "01",
        t: "The signal",
        paras: [
          {
            t: "A new lead signs up online. The gym owner is mid-class. By the time they surface, it’s been 6 hours. The lead’s moved on."
          },
          {
            t: "This was happening everywhere across the Glofox customer base. Not because operators didn’t care, because they were running a physical business with two hands and not enough hours. Every unanswered lead was revenue walking out the door."
          }
        ]
      },
      {
        n: "02",
        t: "The constraint",
        paras: [
          {
            t: "The users weren’t marketers. They were personal trainers who’d started a business. Automation tools built for SaaS teams would’ve terrified them. Whatever we built had to feel like a simple list of things going out, not a workflow engine."
          },
          {
            t: "And it had to prove revenue impact fast. First product of its kind at Glofox. No second chances if it flopped."
          }
        ]
      },
      {
        n: "03",
        t: "The approach",
        paras: [
          {
            t: "Ran discovery across studio owners to find the shape of the problem. The answer was always the same: the first 48 hours. Lead goes cold, it stays cold."
          },
          {
            t: "Built a sequence builder around that insight, trigger-based, timed, dead simple. A lead enters the system and a chain of emails and texts goes out automatically. No jargon, no decision trees, no configuration paralysis."
          },
          {
            t: "Designed the Insights tab alongside it so owners could see exactly what was going out, when, and whether it was working. Numbers they could act on. Not charts they’d ignore."
          }
        ]
      },
      {
        n: "04",
        t: "The outcome",
        paras: [
          {
            t: "2.7x more leads converted for studios using Amplify (BikeRowSki pilot, 5 locations, 6 months). +24% higher lead conversion vs. studios not using the tool. 8,471 hours saved, at an average of 3 minutes per message, across the operator base."
          }
        ]
      }
    ],
    quote: "“With Amplify I know my messages are going out 100% of the time, while I focus on other areas of my business.”",
    quoteBy: "James, Founder, BeatBox Boxing",
    shortLabel: "amplify",
    device: 'phones',
    screens: []
  },
  {
    slug: "movember",
    name: "MOVEMBER",
    tab: "Movember",
    tabM: "Movember",
    company: "Movember",
    year: "2026",
    accent: "#0E7490",
    bg: "#DCECF0",
    desc: "Every 1% on conversion worth a million dollars for the hairiest fundraising platform on earth. Designing for sign-up conversion, fundraiser retention, the moments that made people come back.",
    headline: "The moments that made people come back were what mattered.",
    sub: "Four years improving the Movember fundraising platform, sign-up conversion, fundraiser retention, and the moments in between that made people come back year after year.",
    meta: [
      {
        k: "Company",
        v: "Movember"
      },
      {
        k: "Project",
        v: "Fundraising Platform"
      },
      {
        k: "Year",
        v: "2026"
      },
      {
        k: "Role",
        v: "[Your role]"
      }
    ],
    metrics: [
      {
        v: "+6%",
        l: "Sign-up conversion rate, improved consistently across 3 campaigns"
      },
      {
        v: "~$1M",
        l: "Additional funds raised for each point of conversion"
      },
      {
        v: "$100M",
        l: "Raised a year, in a single month-long campaign"
      }
    ],
    sections: [
      {
        n: "01",
        t: "The signal",
        paras: [
          {
            t: "Movember raises around $100 million a year. It runs on a single month-long campaign. There’s no second window, no Q4 push, no recovery quarter. You get November."
          },
          {
            t: "In that context, a 1% improvement in sign-up conversion isn’t a nice metric to put in a slide, it’s a million dollars for men’s health research. That’s the weight every design decision carried."
          }
        ]
      },
      {
        n: "02",
        t: "The constraint",
        paras: [
          {
            t: "One shot per year. No mid-campaign iteration. The product had to be right before it went live, because fixing it in November wasn’t an option."
          },
          {
            t: "Add to that: a global fundraiser base spanning corporate teams, event hosts, solo participants, returners, and first-timers, all needing a sign-up experience that felt personal without being slow. And a cross-functional environment where product, marketing, data, and charity ops all had a stake in the outcome."
          },
          {
            t: "Alignment was as much the work as the design."
          }
        ]
      },
      {
        n: "03",
        t: "The approach",
        paras: [
          {
            t: "Built the first shared fundraiser experience map across departments, one view of the entire journey from first click to post-campaign reactivation, segmented by fundraiser type and propensity to return."
          },
          {
            t: "It sounds like a workshop output. It became the product strategy."
          },
          {
            t: "Used it to find the drop-off points that mattered most and designed directly at them: tightening the sign-up flow, sharpening the moment-of-commitment messaging, and running re-engagement sequences at lapsed fundraisers who’d raised before but hadn’t returned."
          },
          {
            t: "Iterated campaign by campaign. Slow, compounding, deliberate."
          }
        ]
      },
      {
        n: "04",
        t: "The outcome",
        paras: [
          {
            t: "+6% sign-up conversion rate, improved consistently across 3 campaigns. Each point of that improvement worth approximately $1 million in additional funds raised. The experience map adopted across departments as the standard planning tool for campaign strategy."
          }
        ]
      }
    ],
    quote: "",
    quoteBy: "",
    shortLabel: "movember",
    device: 'monitor',
    screens: []
  }
]

export const ABOUT_INDEX = 0

export function projectIndexBySlug(slug: string): number {
  return projects.findIndex((p) => p.slug === slug)
}
