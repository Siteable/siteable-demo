# siteable-demo

Try-it-online demo shell for [@siteable/core](https://www.npmjs.com/package/@siteable/core) —
the JSON-first visual website builder engine (blocks, `EditorLayout`, AI site
generation) running as a standalone app with no dashboard, no router, and no
server. Build a site in the browser and see the JSON config as the source of
truth.

## Live demo

TODO-after-deploy — the Cloudflare Pages URL will be added here once deployed.

## Development

```bash
npm install     # install dependencies
npm run dev     # start Vite dev server
npm run build   # typecheck (tsc -b) + production build
npm run preview # serve the production build locally
npm run verify  # typecheck + build + tests
```

Contributor gate: `npm run verify` MUST pass before pushing.

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

## License & provenance

MIT — see [LICENSE](LICENSE) and [NOTICE](NOTICE). The engine itself comes from
the `@siteable/core` npm package; this repo holds no OpenPage-derived source.
