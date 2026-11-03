export type ArtKind = 'orb' | 'pill' | 'wave' | 'grad' | 'type' | 'cards' | 'dots' | 'phone' | 'v1' | 'v2' | 'rec' | 'hr' | 'vc' | 'rev' | 'mix' | 'vo' | 'rv' | 'lm' | 'vcm' | 'df' | 'tk' | 'pb'
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

const ART_KINDS: ArtKind[] = ['orb', 'pill', 'wave', 'grad', 'type', 'cards', 'dots', 'phone', 'v1', 'v2', 'rec', 'hr', 'vc', 'rev', 'mix', 'vo', 'rv', 'lm', 'vcm', 'df', 'tk', 'pb']

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
  rec: 'Voice recorder',
  hr: 'Heart rate',
  vc: 'Voice composer',
  rev: 'Revenue chart',
  mix: 'Gradient mixer',
  vo: 'Voice orb',
  rv: 'Reverie',
  lm: 'Lead match',
  vcm: 'Mobile composer',
  df: 'DayFlow',
  tk: 'Biometric ticket',
  pb: 'Plan builder',
}

const DESKTOP_LAYOUT = [
  'blank', 'empty', 'rec', 'empty', 'blank', 'rv', 'pb', 'blank', 'mix', 'empty', 'blank',
  'blank', 'blank', 'lm', 'empty', 'hr', 'blank', 'empty', 'df', 'blank', 'vo', 'blank',
  'blank', 'vc', 'blank', 'tk', 'empty', 'blank', 'rev', 'empty', 'vcm', 'empty', 'blank',
]

const MOBILE_LAYOUT = [
  'rec', 'pb', 'vc', 'rv',
  'lm', 'hr', 'df', 'rev',
  'mix', 'tk', 'vo', 'vcm',
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
