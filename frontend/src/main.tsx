import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App'
import { initializeAnalytics } from './utils/analytics'

// Inicializar Analytics
initializeAnalytics();

// Build version: 2025-11-07-v2
console.log('🚀 App Version: 2025-11-07-v2');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
