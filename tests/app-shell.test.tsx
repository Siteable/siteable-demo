// Phase-2 grading suite for the apps-demo-shell spec (plan 260923-1933).
//
// Grading-proxy disclosures (from the plan — read before "fixing" these):
//
// * SC-003 grades the package-fired toast via the GeminiKeyInputField "Test"
//   path (fetch rejection -> toast.error('Connection failed')), NOT the
//   spec's "e.g. after HTML export" example. The export-path toast is
//   SC-M01 manual (phase 3) — do not add an export-driven toast test here.
//
// * SC-001's "exactly once on app load" is graded as exactly-once-per-module-
//   init: the spy counts calls across ONE fresh import of src/demo-project.
//   The app-level claim rests on main.tsx importing that module exactly once
//   (structurally impossible for a module body to run twice in one graph).
//
// * SC-001 is narrowed to the store state fact ONLY — never assert
//   EditorLayout internal rendering or EditorEmptyState presence/absence.
//
// * SC-002 counts the sonner Toaster's unconditional root
//   <section aria-label^="Notifications" aria-live="polite">, NOT
//   [data-sonner-toaster]: in sonner 2.0.8 that attribute lives on the inner
//   <ol>, which is only mounted WHILE a toast is active (verified against the
//   installed dist — `if (!filteredToasts.length) return null`). The root
//   section is the mount-count proxy; the toast-visible claim belongs to SC-003.
//
// Module-graph hygiene: every test runs vi.resetModules() + dynamic import so
// each gets a fresh, self-consistent copy of @siteable/core/sonner/react.
// No static src/ or @siteable/core imports in this file.
//
// SCANNER-POLLUTION RULE (see tests/build-output.test.ts header): this dir is
// Tailwind-scanned — keep any compiled-class token fragmented ('card' +
// '-lift' style), never intact, in comments or strings.

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const testDir = dirname(fileURLToPath(import.meta.url))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('SC-001 — demo project init fires exactly once at module scope', () => {
  it('setActiveProject is called once with demoProjectId and lands in store state', async () => {
    vi.resetModules()
    const { useEditorStore } = await import('@siteable/core')
    const real = useEditorStore.getState().setActiveProject
    const spy = vi.fn(real)
    useEditorStore.setState({ setActiveProject: spy })
    try {
      const mod = await import('../src/demo-project')
      // Exactly once — not zero, not twice (double-invoke would betray a
      // module-scope call inside a render path or a StrictMode-sensitive spot).
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][0]).toBe(mod.demoProjectId)
      expect(typeof mod.demoProjectId).toBe('string')
      expect(mod.demoProjectId.length).toBeGreaterThan(0)
      // The state fact SC-001 grades: activeProjectId is the demo id.
      expect(useEditorStore.getState().activeProjectId).toBe(mod.demoProjectId)
    } finally {
      // Restore the real action so no later test observes the spy (cross-test
      // leakage guard; later tests also resetModules, belt and braces).
      useEditorStore.setState({ setActiveProject: real })
    }
  })
})

describe('SC-002 — exactly one <Toaster/> and one key field mount with the app', () => {
  it('rendered app has a single sonner toaster and a single AIza input', async () => {
    vi.resetModules()
    const { default: App } = await import('../src/App')
    // M1 guard: mount must never touch the network. Safe today (core@0.1.2's
    // only fetches are click-driven handleTest + guarded generate-site), but
    // a future core bump adding a mount-time fetch should fail loudly here.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('unexpected fetch in test')))
    render(<App />)
    // Why not [data-sonner-toaster] here: see header SC-002 disclosure — the
    // inner <ol> carrying that attribute renders only while a toast is active.
    // One root <Toaster/> mounted with the app, zero or two is a regression.
    expect(
      document.querySelectorAll('section[aria-label^="Notifications"][aria-live="polite"]').length,
    ).toBe(1)
    expect(screen.getAllByPlaceholderText('AIza...')).toHaveLength(1)
  })
})

describe('SC-003 — package-fired toast becomes visible through the app-root <Toaster/>', () => {
  it('failed key test surfaces "Connection failed" from the package path', async () => {
    vi.resetModules()
    const { default: App } = await import('../src/App')
    // Stub BEFORE render so no real network call can ever leak out.
    const fetchStub = vi.fn().mockRejectedValue(new Error('network-down'))
    vi.stubGlobal('fetch', fetchStub)
    render(<App />)

    const input = screen.getByPlaceholderText('AIza...')
    // Obviously fake value — no real key anywhere in this test.
    fireEvent.change(input, { target: { value: 'AIza-test-fake' } })
    fireEvent.click(screen.getByRole('button', { name: 'Test' }))

    // findBy = auto-wait; resolving proves the toast text reached the DOM,
    // i.e. the app-root <Toaster/> receives events fired inside the package.
    await screen.findByText('Connection failed')
    // Proves the package handleTest path (not demo-app code) ran the request.
    expect(fetchStub).toHaveBeenCalled()
  })
})

describe('Constraint lock — App.tsx prop surface stays onCreate-only', () => {
  it('source assigns onCreate and never a host-override prop', () => {
    const appSource = readFileSync(resolve(testDir, '..', 'src', 'App.tsx'), 'utf8')
    expect(appSource).toContain('onCreate=')
    // Prop-assignment shape only; prose in comments (no trailing '=') is allowed.
    expect(appSource).not.toMatch(/\s(activeProject|onExit|onServerFallback)=/)
  })
})
