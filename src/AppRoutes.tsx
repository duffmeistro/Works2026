import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ActiveProjectProvider } from './home/ActiveProject'
import HomeShell from './home/HomeShell'
import Router from './Router'

function LegacySite() {
  useEffect(() => {
    if (window.location.hash && !/^#\/project\//.test(window.location.hash)) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    window.scrollTo(0, 0)
  }, [])
  return <Router />
}

export default function AppRoutes() {
  return (
    <ActiveProjectProvider>
      <Routes>
        <Route path="/archive/*" element={<LegacySite />} />
        <Route path="/*" element={<HomeShell />} />
      </Routes>
    </ActiveProjectProvider>
  )
}
