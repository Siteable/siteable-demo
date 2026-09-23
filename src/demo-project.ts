import { useEditorStore } from '@siteable/core'
// NF-001: set the single demo project id at module scope — this file is
// imported by main.tsx BEFORE createRoot().render(), so activeProjectId is
// non-null before EditorLayout's first paint. Module init runs exactly once
// (SC-001), StrictMode-immune.
export const demoProjectId = crypto.randomUUID()
useEditorStore.getState().setActiveProject(demoProjectId)
