import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node',
    setupFiles: ['dotenv/config', './tests/mongodb-setup.ts', './tests/dom-setup'],
    globals: true,
    /**
     * Set this to one only so that MongoDB memory server can
     * run without being flaky https://github.com/shelfio/jest-mongodb/issues/366
     */
    maxWorkers: process.env.CI === 'true' ? 1 : undefined,
  },
})
