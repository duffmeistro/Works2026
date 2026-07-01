import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './Router'
import './index.css'

// Strip non-project hashes from the URL on load so the browser
// doesn't scroll to a #works or #contact anchor on refresh
if (window.location.hash && !/^#\/project\//.test(window.location.hash)) {
  history.replaceState(null, '', window.location.pathname + window.location.search)
}
window.scrollTo(0, 0)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)
