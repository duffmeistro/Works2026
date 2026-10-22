import { useTheme } from '../Theme'

export function ModeButton({ placement }: { placement: 'grid' | 'header' }) {
  const { dark, toggle } = useTheme()
  return (
    <button
      type="button"
      className={placement === 'grid' ? 'hm-modebtn hm-modebtn--grid' : 'hm-iconbtn hm-modebtn--header'}
      aria-label="Dark mode"
      aria-pressed={dark}
      onClick={toggle}
    >
      <span className="hm-modedot" aria-hidden="true" />
    </button>
  )
}
