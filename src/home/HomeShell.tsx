import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { useActiveProject } from './ActiveProject'
import { useBodyClass, useDocumentTitle } from './hooks'
import HomePage from './HomePage'
import { CaseContent } from './components/CaseContent'
import { Panel } from './components/Panel'
import { projectIndexBySlug, projects } from './projects'
import './home.css'

function CasePage({ index, onClose }: { index: number; onClose: () => void }) {
  const navigate = useNavigate()
  const [shown, setShown] = useState(false)
  useBodyClass('hm-body')
  useDocumentTitle(`${projects[index].name} — Gavan Duffy`)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <main className="hm-root hm-root--page" style={{ backgroundColor: projects[index].bg }}>
      <div className="hm-halftone" aria-hidden="true" />
      <Panel
        label={index === 0 ? 'About Gavan Duffy' : `Case study: ${projects[index].name}`}
        open={shown}
        onClose={onClose}
        onNext={() => navigate(`/work/${projects[(index + 1) % projects.length].slug}`, { replace: true })}
      >
        {(goNext) => <CaseContent project={projects[index]} index={index} open={shown} onNext={goNext} />}
      </Panel>
    </main>
  )
}

export default function HomeShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const match = useMatch('/work/:slug')
  const playItem = useMatch('/playground/:id')
  const playRoot = useMatch('/playground')
  const { setActive } = useActiveProject()
  const homeSeen = useRef(!match)
  if (!match) homeSeen.current = true

  const slugIndex = match ? projectIndexBySlug(match.params.slug ?? '') : -1

  useEffect(() => {
    if (slugIndex >= 0) setActive(slugIndex)
  }, [slugIndex, setActive])

  const close = () => {
    if (location.key === 'default') navigate(playItem ? '/playground' : '/', { replace: true })
    else navigate(-1)
  }
  const playing = !!(playItem || playRoot)

  if ((match && slugIndex < 0) || (!match && !playing && location.pathname !== '/')) {
    return <Navigate to="/" replace />
  }
  if (match && !homeSeen.current) return <CasePage index={slugIndex} onClose={() => navigate('/')} />
  return <HomePage panelIndex={slugIndex} playing={playing} playId={playItem?.params.id ?? null} onClosePanel={close} />
}
