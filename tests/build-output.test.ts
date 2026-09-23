// SC-004 — the compiled stylesheet must carry the demo design-token utilities.
//
// Gate ordering note (plan D5): `npm run verify` (build -> test) is the gate.
// `npx vitest run` alone is RED on a clean checkout until a build has run —
// by design, because this test grades the COMPILED output, not the sources.
// There is deliberately no describe.skipIf: a skip would hide an ungraded
// gate, so a missing build fails loudly with the exact remedy below.
//
// Mechanism (corrected 2026-09-23 after REVIEW1 re-measurement + clean
// controlled rebuilds; bytes below are concatenated-CSS string lengths):
// * The @source glob in src/index.css IS load-bearing: good wiring -> 53,868
//   B; @source path pointing into a nonexistent directory -> 6,010 B; @source
//   line deleted -> 6,010 B (byte-for-byte the same, both lose every package
//   utility incl. 'card' + '-lift' and 'accent' + '-glow-md' — node_modules
//   is excluded from Tailwind v4 auto-scan, only the explicit @source reaches
//   it). Nuance: breaking just the trailing extension (valid directory
//   prefix, dead file pattern) still compiles full CSS — the scanner keeps
//   the intact static prefix directory. So "bogus" must break the path.
// * SC-004 grades BOTH engine-wiring lines through these greps: the @source
//   glob (dead path or removal -> needles 1+2 go red) and the core styles
//   @import (measured 39,618 B without it: candidates still scan, but the
//   @utility definitions themselves are gone -> needles 1+2 red again).
// * Third needle: '--color' + '-accent-rgb:' — DEFINITION form (colon). The
//   core utilities compile a comma-form var() REFERENCE to the same custom
//   property, so the bare name alone does not grade the demo :root block;
//   dropping the definition line (53,831 B) reddens exactly this needle.
// * Honest correction: an earlier revision claimed the glob was inert. Two
//   mistakes compound there: (1) its bogus mutation only killed the file
//   pattern, leaving the scanned directory prefix alive (see Nuance above),
//   and (2) intact needle literals in that revision's own comments could
//   re-supply candidates from this auto-scanned dir. Both fixed: path-break
//   grading + the SCANNER-POLLUTION RULE below.
//
// SCANNER-POLLUTION RULE (applies to EVERY file under tests/): this directory
// is inside Tailwind's auto-scanned tree and is not gitignored, so any intact
// compiled-class literal — even inside a comment — becomes a candidate and can
// make the build contain what a grep then "independently" verifies. Keep
// needle-shaped tokens split (['card','-lift'].join('')) in code AND prose.

import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = resolve(repoRoot, 'dist', 'assets')

const NEEDLES: ReadonlyArray<readonly [string, string]> = [
  // [label, needle assembled at runtime — see SCANNER-POLLUTION RULE]
  ['core utility: card lift', ['card', '-lift'].join('')],
  ['core utility: accent glow md', ['accent', '-glow-md'].join('')],
  ['demo token: accent rgb definition', ['--color', '-accent-rgb:'].join('')],
]

describe('SC-004 — compiled CSS contains the demo token utilities', () => {
  it('grades dist/assets/*.css produced by npm run build', () => {
    if (!existsSync(assetsDir)) {
      throw new Error(
        'run npm run build first — SC-004 grades compiled output ' +
          `(no build directory at ${assetsDir})`,
      )
    }
    const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.css'))
    if (cssFiles.length === 0) {
      throw new Error(
        'run npm run build first — SC-004 grades compiled output ' +
          `(no *.css found in ${assetsDir})`,
      )
    }
    // Concatenate every emitted stylesheet: Vite hashes/splits assets, the
    // grep must hold against the compiled artifact however it is chunked.
    const css = cssFiles
      .map((f) => readFileSync(resolve(assetsDir, f), 'utf8'))
      .join('\n')

    for (const [label, needle] of NEEDLES) {
      expect(css, `${label} missing from compiled CSS`).toContain(needle)
    }
  })
})
