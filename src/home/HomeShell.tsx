import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { useActiveProject } from './ActiveProject'
import { useBodyClass, useDocumentTitle } from './hooks'
import { useTheme } from './Theme'
import { Loader } from './components/Loader'
import HomePage from './HomePage'
import { CaseContent } from './components/CaseContent'
import { Panel } from './components/Panel'
import { projectIndexBySlug, projects } from './projects'
import './styles/index.css'

function CasePage({ index, onClose }: { index: number; onClose: () => void }) {
  const navigate = useNavigate()
  const [shown, setShown] = useState(false)
  const { dark } = useTheme()
  useBodyClass('hm-body')
  useDocumentTitle(index === 0 ? 'About — Gavan Duffy' : `${projects[index].homeName} — Gavan Duffy`)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <main className={dark ? 'hm-root hm-root--page is-dark' : 'hm-root hm-root--page'}>
      <div className="hm-halftone" aria-hidden="true" />
      <Panel
        label={index === 0 ? 'About Gavan Duffy' : `Case study: ${projects[index].homeName}`}
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
  return (
    <>
      {match && !homeSeen.current ? (
        <CasePage index={slugIndex} onClose={() => navigate('/')} />
      ) : (
        <HomePage panelIndex={slugIndex} playing={playing} playId={playItem?.params.id ?? null} onClosePanel={close} />
      )}
      <Loader />
    </>
  )
}
