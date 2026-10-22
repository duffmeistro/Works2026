import type { LayerState } from '../layerState'

type RollingProps = {
  items: string[]
  states: LayerState[]
  variant: 'roll' | 'roll-delay' | 'fade'
}

export function Rolling({ items, states, variant }: RollingProps) {
  return (
    <>
      {items.map((text, i) => {
        const Tag = variant === 'fade' ? 'p' : 'div'
        return (
          <Tag
            key={i}
            className={`hm-${variant === 'roll-delay' ? 'roll hm-roll--delay' : variant} is-${states[i]}`}
            aria-hidden={states[i] !== 'active'}
          >
            {text}
          </Tag>
        )
      })}
    </>
  )
}
