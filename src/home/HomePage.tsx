import { useCallback, useRef, useState, type TouchEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveProject } from './ActiveProject'
import { useArrowKeys, useBodyClass, useDocumentTitle, useElementHeight, useMediaQuery } from './hooks'
import { layerState } from './layerState'
import { desktopTiles, findTile, mobileTiles, type Tile } from './playground'
import { projects } from './projects'
import { AboutBlock } from './components/AboutBlock'
import { CaseContent } from './components/CaseContent'
import { MobileMenu } from './components/MobileMenu'
import { Panel } from './components/Panel'
import { BackBar, PlaygroundGrid } from './components/PlaygroundGrid'
import { PlayContent } from './components/PlayContent'
import { ModeButton } from './components/ModeButton'
import { SiteHeader } from './components/SiteHeader'
import { Stage } from './components/Stage'
import { TabBar } from './components/TabBar'
import { ViewButton, ViewZone } from './components/ViewZone'
import { useTheme } from './Theme'
import './styles/index.css'

const SWIPE_THRESHOLD = 40
const STAGE_HEIGHT_DESKTOP = 600
const STAGE_HEIGHT_MOBILE = 381

type HomePageProps = {
  panelIndex: number
  playing: boolean
  playId: string | null
  onClosePanel: () => void
}

type PanelView = { kind: 'project'; index: number } | { kind: 'play'; tile: Tile }

export default function HomePage({ panelIndex, playing, playId, onClosePanel }: HomePageProps) {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const tiles = isMobile ? mobileTiles : desktopTiles
  const playTile = findTile(tiles, playId ?? undefined) ?? findTile(desktopTiles, playId ?? undefined)
  const panelOpen = panelIndex >= 0 || !!playTile
  const { active, setActive, step } = useActiveProject()
  const [menuOpen, setMenuOpen] = useState(false)
  const { dark } = useTheme()
  const swipeStart = useRef<number | null>(null)
  const zoneRef = useRef<HTMLAnchorElement>(null)
  const viewBtnRef = useRef<HTMLAnchorElement>(null)
  const [fitRef, fitHeight] = useElementHeight<HTMLDivElement>()
  const stageScale = fitHeight
    ? Math.min(1, fitHeight / (isMobile ? STAGE_HEIGHT_MOBILE : STAGE_HEIGHT_DESKTOP))
    : 1

  useBodyClass('hm-body')
  useArrowKeys(step, !menuOpen && !panelOpen && !playing)

  const project = projects[active]
  const shown = useRef<PanelView>({ kind: 'project', index: active })
  if (playTile) shown.current = { kind: 'play', tile: playTile }
  else if (panelIndex >= 0) shown.current = { kind: 'project', index: panelIndex }
  const view = shown.current
  const baseTitle = 'Gavan Duffy — Senior Product Designer'
  useDocumentTitle(
    !panelOpen
      ? playing
        ? `Playground — ${baseTitle}`
        : baseTitle
      : view.kind === 'play'
        ? `${view.tile.title} — Playground — Gavan Duffy`
        : view.index === 0
          ? `About — ${baseTitle}`
          : `${projects[view.index].homeName} — Gavan Duffy`,
  )
  const states = projects.map((_, i) => layerState(i, active))

  const openAbout = useCallback(() => {
    setMenuOpen(false)
    navigate('/work/about')
  }, [navigate])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const restoreFocus = useCallback(() => {
    const target = [zoneRef.current, viewBtnRef.current].find((el) => el && el.offsetParent !== null)
    target?.focus({ preventScroll: true })
  }, [])

  const onTouchStart = (e: TouchEvent) => {
    swipeStart.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e: TouchEvent) => {
    const start = swipeStart.current
    const end = e.changedTouches[0]?.clientX
    swipeStart.current = null
    if (start === null || end === undefined) return
    const dx = end - start
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    step(dx < 0 ? 1 : -1)
  }

  return (
    <main className={['hm-root', playing && 'is-play', dark && 'is-dark'].filter(Boolean).join(' ')}>
      <div className="hm-halftone" aria-hidden="true" />

      <div className="hm-home" {...(panelOpen ? { inert: '' } : {})}>
        <SiteHeader onAbout={openAbout} onToggleMenu={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />

        <div className="hm-stagearea" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className={active === 0 ? 'hm-bigword hm-hip is-off' : 'hm-bigword hm-hip'} aria-hidden="true">
            _works _26
          </div>
          <div ref={fitRef} className="hm-stagefit" aria-hidden="true" />
          <Stage active={active} scale={stageScale} />
          <AboutBlock on={active === 0} />
        </div>

        <ViewZone ref={zoneRef} project={project} index={active} />
        <ViewButton ref={viewBtnRef} project={project} index={active} />

        <div className="hm-desc hm-hip" aria-live="polite">
          {projects.map((p, i) => (
            <div key={p.slug} className={`hm-fade is-${states[i]}`} aria-hidden={states[i] !== 'active'}>
              {p.homeName && (
                <h2 className="hm-fade__title">
                  {p.homeName}
                  <span className="hm-fade__year">[{p.year}]</span>
                </h2>
              )}
              <p className="hm-fade__text">{p.homeDescription}</p>
            </div>
          ))}
        </div>

        <TabBar active={active} onPick={setActive} />
        <ModeButton placement="grid" />

        <PlaygroundGrid tiles={tiles} playing={playing} />
        <BackBar playing={playing} />

        {menuOpen && <MobileMenu onClose={closeMenu} onAbout={openAbout} />}
      </div>

      <Panel
        label={
          view.kind === 'play'
            ? `Playground: ${view.tile.title}`
            : view.index === 0
              ? 'About Gavan Duffy'
              : `Case study: ${projects[view.index].homeName}`
        }
        open={panelOpen}
        onClose={onClosePanel}
        onClosed={restoreFocus}
        onNext={
          view.kind === 'project'
            ? () => navigate(`/work/${projects[(view.index + 1) % projects.length].slug}`, { replace: true })
            : undefined
        }
      >
        {(goNext) =>
          view.kind === 'play' ? (
            <PlayContent tile={view.tile} />
          ) : (
            <CaseContent project={projects[view.index]} index={view.index} open={panelOpen} onNext={goNext} />
          )
        }
      </Panel>
    </main>
  )
}
