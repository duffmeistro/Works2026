function Pill({ n, kind, children }: { n: number; kind: string; children?: React.ReactNode }) {
  return (
    <span className={`hm-apill hm-ap${n} hm-pill-${kind}`} aria-hidden="true">
      {children}
    </span>
  )
}

const WAVE_DELAYS = [-0.1, -0.5, -0.3, -0.8, -0.2, -0.6, -0.4]

export function AboutBlock({ on }: { on: boolean }) {
  return (
    <div className={on ? 'hm-about hm-hip is-on' : 'hm-about hm-hip'} aria-hidden={!on}>
      <div className="hm-about__inner">
        <h1 className="hm-about__title">
          <span className="hm-aline hm-a1">
            Hey{' '}
            <Pill n={1} kind="portrait">
              <span className="hm-pp-head" />
              <span className="hm-pp-body" />
            </Pill>{' '}
            I’m Gav
          </span>
          <span className="hm-aline hm-a2">
            I design{' '}
            <Pill n={2} kind="swirl">
              <span className="hm-sw" />
              <span className="hm-sw2" />
            </Pill>{' '}
            AI tools
          </span>
        </h1>
        <p className="hm-aline hm-a3 hm-about__text">
          Based in Ireland{' '}
          <Pill n={3} kind="land">
            <span className="hm-sea" />
            <span className="hm-sun" />
            <span className="hm-hill1" />
            <span className="hm-hill2" />
          </Pill>
          , I’m a senior product designer with 10+ years in tech, now at HubSpot, designing
          AI-assisted tools for sales and productivity. My work spans mobile CRM{' '}
          <Pill n={4} kind="phone">
            <span className="hm-phm hm-phm1">
              <span className="hm-phb" />
            </span>
            <span className="hm-phm hm-phm2">
              <span className="hm-phb" />
            </span>
          </Pill>
          , meeting capture{' '}
          <Pill n={5} kind="wave">
            {WAVE_DELAYS.map((d) => (
              <span key={d} className="hm-wb" style={{ animationDelay: `${d}s` }} />
            ))}
          </Pill>{' '}
          and growth, and I build the prototypes{' '}
          <Pill n={6} kind="proto">
            <span className="hm-pf hm-pf1" />
            <span className="hm-pf hm-pf2" />
            <span className="hm-pf hm-pf3" />
            <span className="hm-pcur" />
          </Pill>{' '}
          myself.
        </p>
      </div>
    </div>
  )
}
