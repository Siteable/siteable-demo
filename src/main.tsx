// Load-ordering is LOAD-BEARING (NF-001): './demo-project' must be the first
// import so useEditorStore.setActiveProject runs at module-init time, before
// createRoot().render() paints EditorLayout. Do not reorder.
import './demo-project'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// NEG-TEST canary: intentional TS syntax error (removed by push --force never; branch deleted)
const broken: = 
