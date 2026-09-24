// Runtime prop-capture lock for the spec Constraint "propless host path":
// EditorLayout must receive onCreate and NOTHING ELSE.
//
// Why a second layer on top of the textual regex in app-shell.test.tsx:
// source-text matching is bypassable by JSX formatting tricks (prop spread,
// reflowed attributes, quoted-object shorthands). This test observes the
// props object React actually received — no formatting can hide a key from
// Object.keys(). Both layers stay (defense-in-depth).
//
// Mock scoping: vi.mock lives in THIS file only; vitest isolates test files
// into separate module registries, so app-shell.test.tsx keeps rendering the
// real EditorLayout untouched. The factory spreads importOriginal() so every
// other barrel export (useEditorStore-backed demo-project init,
// GeminiKeyInputField, validateSiteConfig, ...) remains the real thing — only
// EditorLayout is swapped for the capturing spy.

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'

// vi.mock factories are hoisted above imports, so the capture slot must be
// created in hoisted scope to be referenceable from the factory.
const capture = vi.hoisted(() => ({
  props: undefined as Record<string, unknown> | undefined,
}))

vi.mock('@siteable/core', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    // Spy component: records the exact props object, renders nothing.
    EditorLayout: (props: Record<string, unknown>) => {
      capture.props = props
      return null
    },
  }
})

afterEach(() => {
  cleanup()
  capture.props = undefined
  vi.unstubAllGlobals()
})

describe('Constraint lock — EditorLayout props captured at runtime are onCreate-only', () => {
  it('App passes exactly one prop to EditorLayout and it is a function', async () => {
    vi.resetModules()
    const { default: App } = await import('../src/App')
    // Same mount-must-not-touch-network guard as app-shell SC-002.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('unexpected fetch in test')))
    render(<App />)

    const props = capture.props
    expect(props, 'EditorLayout spy must have rendered with the App').toBeDefined()
    // Any extra prop (activeProject, onExit, onServerFallback, a spread —
    // whatever its JSX shape) fails this set equality immediately.
    expect(Object.keys(props).sort()).toEqual(['onCreate'])
    expect(typeof props.onCreate).toBe('function')
  })
})
