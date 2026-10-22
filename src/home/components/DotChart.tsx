import { useMemo, type CSSProperties } from 'react'
import { buildChart, CHART_H, CHART_W, type ChartSpec } from '../charts'

const LABEL_BASELINE = 12

export function DotChart({ spec, label }: { spec: ChartSpec; label: string }) {
  const { dots, labels } = useMemo(() => buildChart(spec), [spec])
  return (
    <svg
      className="hm-chart"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      width={CHART_W}
      height={CHART_H}
      role="img"
      aria-label={label}
      overflow="visible"
    >
      {dots.map((dot, i) => (
        <circle
          key={i}
          className={`hm-dt hm-dt--${dot.kind}${dot.delay !== undefined ? ' is-on' : ''}`}
          cx={dot.x.toFixed(1)}
          cy={dot.y.toFixed(1)}
          r={(dot.d / 2).toFixed(2)}
          style={
            {
              fillOpacity: dot.alpha !== undefined ? dot.alpha.toFixed(2) : undefined,
              animationDelay: dot.delay !== undefined ? `${dot.delay.toFixed(2)}s` : undefined,
            } as CSSProperties
          }
        />
      ))}
      {labels.map((l) => (
        <text key={l.text} className="hm-chart__lbl" x={l.x} y={l.y + LABEL_BASELINE} aria-hidden="true">
          {l.text}
        </text>
      ))}
    </svg>
  )
}
