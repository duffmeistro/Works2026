import { useCallback, useRef, useState, type TouchEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveProject } from './ActiveProject'
import { useArrowKeys, useBodyClass, useDocumentTitle, useMediaQuery } from './hooks'
import { layerState } from './layerState'
import { desktopTiles, findTile, mobileTiles, type Tile } from './playground'
import { projects } from './projects'
import { AboutBlock } from './components/AboutBlock'
import { CaseContent } from './components/CaseContent'
import { MobileMenu } from './components/MobileMenu'
import { Panel } from './components/Panel'
import { BackBar, PlaygroundGrid } from './components/PlaygroundGrid'
import { PlayContent } from './components/PlayContent'
import { Rolling } from './components/Rolling'
import { SiteHeader } from './components/SiteHeader'
import { Stage } from './components/Stage'
import { TabBar } from './components/TabBar'
import { ViewButton, ViewZone } from './components/ViewZone'
import './home.css'

const SWIPE_THRESHOLD = 40

type HomePageProps = {
  panelIndex: number
  playing: boolean
  playId: string | null
  onClosePanel: () => void
}

type PanelView = { kind: 'project'; index: number } | { kind: 'play'; tile: Tile }

const PLAY_BG = '#ECE9E3'

export default function HomePage({ panelIndex, playing, playId, onClosePanel }: HomePageProps) {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const tiles = isMobile ? mobileTiles : desktopTiles
  const playTile = findTile(tiles, playId ?? undefined) ?? findTile(desktopTiles, playId ?? undefined)
  const panelOpen = panelIndex >= 0 || !!playTile
  const { active, setActive, step } = useActiveProject()
  const [menuOpen, setMenuOpen] = useState(false)
  const swipeStart = useRef<number | null>(null)
  const zoneRef = useRef<HTMLAnchorElement>(null)
  const viewBtnRef = useRef<HTMLAnchorElement>(null)

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
          : `${projects[view.index].name} — Gavan Duffy`,
  )
  const states = projects.map((_, i) => layerState(i, active))
  const names = projects.map((p, i) => (i === 0 ? '' : p.name))
  const years = projects.map((p, i) => (i === 0 ? '' : p.year))
  const descs = projects.map((p, i) => (i === 0 ? '' : p.desc))

  const goAbout = useCallback(() => {
    setActive(0)
    setMenuOpen(false)
    if (playing) navigate('/')
  }, [setActive, playing, navigate])
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
    <main className={playing ? 'hm-root is-play' : 'hm-root'} style={{ backgroundColor: playing ? PLAY_BG : project.bg }}>
      <div className="hm-halftone" aria-hidden="true" />

      <div className="hm-home" {...(panelOpen ? { inert: '' } : {})}>
        <SiteHeader onAbout={goAbout} onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />

        <div className="hm-nameyear" aria-live="polite">
          <div className="hm-mask hm-name hm-hip">
            <Rolling items={names} states={states} variant="roll" />
          </div>
          <div className="hm-mask hm-year hm-hip">
            <Rolling items={years} states={states} variant="roll-delay" />
          </div>
        </div>

        <div className="hm-stagearea" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <Stage active={active} />
          <AboutBlock on={active === 0} />
        </div>

        <ViewZone ref={zoneRef} project={project} index={active} />
        <ViewButton ref={viewBtnRef} project={project} index={active} />

        <div className="hm-mask hm-desc hm-hip" aria-live="polite">
          <Rolling items={descs} states={states} variant="fade" />
        </div>

        <TabBar active={active} onPick={setActive} />

        <PlaygroundGrid tiles={tiles} playing={playing} />
        <BackBar playing={playing} />

        {menuOpen && <MobileMenu onClose={closeMenu} onAbout={goAbout} />}
      </div>

      <Panel
        label={
          view.kind === 'play'
            ? `Playground: ${view.tile.title}`
            : view.index === 0
              ? 'About Gavan Duffy'
              : `Case study: ${projects[view.index].name}`
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
