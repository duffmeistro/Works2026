export type ArtKind = 'orb' | 'pill' | 'wave' | 'grad' | 'type' | 'cards' | 'dots' | 'phone' | 'v1' | 'v2'
export type TileKind = ArtKind | 'text1' | 'text2' | 'text3' | 'blank' | 'empty'

export type Tile = {
  index: number
  kind: TileKind
  colour: number
  id: string | null
  title: string
  number: string
}

export const ACCENTS = ['#E7A33E', '#1E7B5C', '#8B5CF6', '#0E7490', '#FF5A36', '#2E3BFF']
export const TINTS = ['#F8EDDB', '#DFEDE6', '#ECE5FB', '#DCECF0', '#FBE6DE', '#E3E5FB']

const ART_KINDS: ArtKind[] = ['orb', 'pill', 'wave', 'grad', 'type', 'cards', 'dots', 'phone', 'v1', 'v2']

const TITLES: Record<ArtKind, string> = {
  orb: 'Liquid orbs',
  pill: 'Pill study',
  wave: 'Voice waveform',
  grad: 'Deep gradients',
  type: 'Type specimen',
  cards: 'UI card stacks',
  dots: 'Dot matrix',
  phone: 'Ghost devices',
  v1: 'Voice assistant — answer',
  v2: 'Voice assistant — ready',
}

const DESKTOP_LAYOUT = [
  'text1', 'blank', 'v2', 'blank', 'empty', 'blank', 'orb:2', 'blank', 'text2', 'blank', 'pill:0',
  'wave:0', 'grad:3', 'blank', 'empty', 'blank', 'type:1', 'blank', 'cards:5', 'phone:4', 'blank', 'empty',
  'blank', 'empty', 'dots:2', 'blank', 'v1', 'blank', 'empty', 'blank', 'orb:5', 'grad:0', 'blank',
  'pill:3', 'blank', 'blank', 'cards:1', 'blank', 'wave:4', 'orb:0', 'blank', 'blank', 'empty', 'type:2',
  'empty', 'phone:1', 'blank', 'grad:5', 'empty', 'blank', 'dots:3', 'pill:2', 'blank', 'text3', 'blank',
]

const MOBILE_LAYOUT = [
  'text1', 'v2', 'blank', 'orb:2',
  'blank', 'empty', 'wave:0', 'blank',
  'grad:3', 'blank', 'v1', 'empty',
  'blank', 'type:1', 'blank', 'pill:0',
  'cards:5', 'blank', 'empty', 'phone:4',
  'empty', 'dots:2', 'text2', 'grad:0',
  'blank', 'orb:5', 'pill:3', 'text3',
]

function buildTiles(layout: string[]): Tile[] {
  let artCount = 0
  return layout.map((code, index) => {
    const [kindCode, colourCode] = code.split(':')
    const kind = kindCode as TileKind
    const colour = colourCode ? parseInt(colourCode, 10) : 0
    const isArt = ART_KINDS.includes(kind as ArtKind)
    if (isArt) artCount += 1
    return {
      index,
      kind,
      colour,
      id: isArt ? `${kind}-${colour}` : null,
      title: isArt ? TITLES[kind as ArtKind] : '',
      number: isArt ? `No.${String(artCount).padStart(2, '0')}` : '',
    }
  })
}

export const desktopTiles = buildTiles(DESKTOP_LAYOUT)
export const mobileTiles = buildTiles(MOBILE_LAYOUT)

export function findTile(tiles: Tile[], id: string | undefined): Tile | undefined {
  return id ? tiles.find((t) => t.id === id) : undefined
}
