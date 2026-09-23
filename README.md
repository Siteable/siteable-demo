# siteable-demo

Single-page demo of [@siteable/core](https://www.npmjs.com/package/@siteable/core) — the
siteable editor engine (blocks, `EditorLayout`, AI site generation) running as a
standalone app shell with no dashboard, no router, and no server.

## Commands

```bash
npm install     # install dependencies
npm run dev     # start Vite dev server
npm run build   # typecheck (tsc -b) + production build
npm run preview # serve the production build locally
```

## Bring-your-own-key (BYOK)

Generation uses your own Google Gemini API key, entered in the in-app key field.
The key is stored **only in your browser's localStorage** and sent directly from
your browser to Google — no server ever sees it.

## Browser requirement

Uses `crypto.randomUUID`, so it needs a modern evergreen browser (Chrome/Edge/
Firefox/Safari current) served over HTTPS or localhost.

## Live demo

URL will be added here in a later phase (deployment pending).
