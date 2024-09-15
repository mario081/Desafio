import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/home/App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
