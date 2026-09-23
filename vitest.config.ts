import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Vitest config for the demo repo — mirrors siteable-core's shape (jsdom +
 * localStorage polyfill). No '@' alias: the demo src uses relative imports.
 * The setup file rebinds `globalThis.localStorage` to an in-memory Storage to
 * dodge the Node >= 22 experimental accessor that shadows jsdom's — see
 * tests/setup/dom-polyfills.ts.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./tests/setup/dom-polyfills.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
