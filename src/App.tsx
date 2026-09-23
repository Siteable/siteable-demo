import { EditorLayout, GeminiKeyInputField } from '@siteable/core'
import { Toaster } from 'sonner'
import { demoProjectId } from './demo-project'

export default function App() {
  return (
    <>
      <GeminiKeyInputField />
      {/* Propless host path (spec Constraint): onCreate ONLY — never
          activeProject / onExit / onServerFallback. */}
      <EditorLayout onCreate={() => demoProjectId} />
      <Toaster theme="dark" position="bottom-right" />
    </>
  )
}
