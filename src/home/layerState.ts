export type LayerState = 'active' | 'before' | 'after'

export function layerState(index: number, active: number): LayerState {
  if (index === active) return 'active'
  return index < active ? 'before' : 'after'
}
