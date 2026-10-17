import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/400-italic.css'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/tenor-sans/400.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Offline: keep the app on the phone so it opens without signal (live site only, not in dev)
if ('serviceWorker' in navigator && (import.meta as any).env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      const urls = [location.origin + '/', ...performance.getEntriesByType('resource').map(e => e.name).filter(u => u.startsWith(location.origin))]
      const send = () => reg.active && reg.active.postMessage({ type: 'cache', urls })
      if (reg.active) send(); else navigator.serviceWorker.ready.then(send)
    }).catch(() => {})
  })
}
