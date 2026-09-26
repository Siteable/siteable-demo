# siteable-demo

Try-it-online demo shell for [@siteable/core](https://www.npmjs.com/package/@siteable/core) —
the JSON-first visual website builder engine (blocks, `EditorLayout`, AI site
generation) running as a standalone app with no dashboard, no router, and no
server. Build a site in the browser and see the JSON config as the source of
truth.

## Live demo

**https://demo.siteable.app** — always built by Cloudflare Pages from the
latest push to `main` (CI origin: `siteable-demo.pages.dev`; preview URLs exist per non-`main` branch).

## Development

```bash
npm install     # install dependencies
npm run dev     # start Vite dev server
npm run build   # typecheck (tsc -b) + production build
npm run preview # serve the production build locally
npm run verify  # typecheck + build + tests
```

Contributor gate: `npm run verify` MUST pass before pushing.

Also run a full-history secret scan with gitleaks (pinned v8.21.2, e.g.
`gitleaks detect --log-opts="--all"`) before pushing — the Pages deploy pipeline
runs no test gate of its own.

Cloudflare Pages builds on push to `main` — there is no other CI.

### Updating the engine

`@siteable/core` is pinned to an exact version. To update it: bump the pin,
run `npm run verify`, and push — Cloudflare Pages redeploys automatically on
push to `main`.

## Bring-your-own-key (BYOK)

Generation uses your own Google Gemini API key, entered in the in-app key field.
The key is stored **only in your browser's localStorage** and sent directly from
your browser to Google — no server ever sees it.

## Browser requirement

Uses `crypto.randomUUID`, so it needs a modern evergreen browser (Chrome/Edge/
Firefox/Safari current) served over HTTPS or localhost.

## Contributing

Workflow (GitHub Flow, single `main`):

- All changes land via PR — `main` is protected, direct pushes are rejected.
- Required status checks on every PR: `verify` and `secret-scan`.
- **Squash-merge only** — merge commits and rebase-merge are disabled; the
  squash commit message is the PR title. Use a Conventional Commit-style PR
  title (`feat:`, `fix:`, `docs:`, …) — it becomes the permanent `main`
  history entry.

## License & provenance

MIT — see [LICENSE](LICENSE) and [NOTICE](NOTICE). The engine itself comes from
the `@siteable/core` npm package; this repo holds no OpenPage-derived source.
