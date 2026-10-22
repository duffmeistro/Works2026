const FRAME =
  'M10.5 0.5H47.5C53.0228 0.5 57.5 4.97715 57.5 10.5C57.5 16.0228 53.0228 20.5 47.5 20.5H10.5C4.97715 20.5 0.5 16.0228 0.5 10.5C0.5 4.97715 4.97715 0.5 10.5 0.5Z'

function Illustration({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <span className={`hm-apill hm-ap${n} hm-pill-ill`} aria-hidden="true">
      <svg viewBox="0 0 58 21" fill="none" stroke="currentColor" strokeWidth="1">
        <path d={FRAME} />
        {children}
      </svg>
    </span>
  )
}

const SPARKLE = (x: number) =>
  `M${x} 5.30371C${x + 0.2154} 5.30371 ${x + 0.39} 5.47836 ${x + 0.39} 5.69371C${x + 0.39} 8.27852 ${x + 2.4852} 10.3737 ${x + 5.07} 10.3737C${x + 5.2854} 10.3737 ${x + 5.46} 10.5484 ${x + 5.46} 10.7637C${x + 5.46} 10.9791 ${x + 5.2854} 11.1537 ${x + 5.07} 11.1537C${x + 2.4853} 11.1537 ${x + 0.3901} 13.2489 ${x + 0.39} 15.8337C${x + 0.39} 16.0491 ${x + 0.2154} 16.2237 ${x} 16.2237C${x - 0.2153} 16.2237 ${x - 0.39} 16.0491 ${x - 0.39} 15.8337C${x - 0.39} 13.2489 ${x - 2.4852} 11.1537 ${x - 5.07} 11.1537C${x - 5.2853} 11.1537 ${x - 5.46} 10.9791 ${x - 5.46} 10.7637C${x - 5.46} 10.5484 ${x - 5.2853} 10.3737 ${x - 5.07} 10.3737C${x - 2.4851} 10.3737 ${x - 0.39} 8.27852 ${x - 0.39} 5.69371C${x - 0.3899} 5.47836 ${x - 0.2153} 5.30371 ${x} 5.30371Z`

export function AboutBlock({ on }: { on: boolean }) {
  return (
    <div className={on ? 'hm-about hm-hip is-on' : 'hm-about hm-hip'} aria-hidden={!on}>
      <div className="hm-about__inner">
        <h1 className="hm-about__title">
          <span className="hm-aline hm-a1">
            Hey I’m Gav{' '}
            <span className="hm-apill hm-ap1 hm-pill-photo" aria-hidden="true">
              <img src="/work/about/portrait-pill.jpg" alt="" width={326} height={152} />
            </span>
            , I design
          </span>
          <span className="hm-aline hm-a2">the things you tap</span>
        </h1>
        <p className="hm-aline hm-a3 hm-about__text">
          I’m a senior product designer with 10+ years in tech based in Ireland{' '}
          <Illustration n={3}>
            <path d="M56.5 6.5H45.5C44.3954 6.5 43.5 7.39543 43.5 8.5V9M43.5 9V20M43.5 9H38.5C37.3954 9 36.5 9.89543 36.5 11V12.5M36.5 12.5V20.5M36.5 12.5H35.5H33C31.8954 12.5 31 13.3954 31 14.5V20.5" />
            <path fill="currentColor" d="M16.5 8.5C16.5 10.7091 14.7091 12.5 12.5 12.5C10.2909 12.5 8.5 10.7091 8.5 8.5C8.5 6.29086 10.2909 4.5 12.5 4.5C14.7091 4.5 16.5 6.29086 16.5 8.5Z" />
          </Illustration>
          . I’m currently @ HubSpot designing mobile{' '}
          <Illustration n={4}>
            <path d="M19 20.5V7.5C19 5.84315 20.3431 4.5 22 4.5H36C37.6569 4.5 39 5.84315 39 7.5V13C39 14.6569 37.6569 16 36 16H30.75C30.3358 16 30 16.3358 30 16.75C30 17.1642 30.3358 17.5 30.75 17.5H36C37.6569 17.5 39 18.8431 39 20.5" />
            <rect x="26" y="6" width="6" height="2" rx="1" stroke="none" fill="currentColor" />
          </Illustration>{' '}
          AI and voice tools{' '}
          <Illustration n={5}>
            <path stroke="none" fill="currentColor" d={SPARKLE(22.2412)} />
            <path stroke="none" fill="currentColor" d={SPARKLE(35.7608)} />
          </Illustration>{' '}
          that help small businesses grow better. I love turning sticky problems into simple solutions and
          prototyping in code{' '}
          <Illustration n={6}>
            <path d="M24 6.02539L17.5 9.77802C16.8334 10.1629 16.8334 11.1252 17.5 11.5101L23.5 14.9742" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30.75 3.5L27 17.5" strokeLinecap="round" />
            <path d="M33.75 6.02539L40.25 9.77802C40.9166 10.1629 40.9166 11.1252 40.25 11.5101L34.25 14.9742" strokeLinecap="round" strokeLinejoin="round" />
          </Illustration>
          .
        </p>
      </div>
    </div>
  )
}
