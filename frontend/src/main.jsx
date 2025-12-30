import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Conduit from './orchestrator/Conduit.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Conduit />
  </StrictMode>,
)
