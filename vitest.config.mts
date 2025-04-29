import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import { coverageConfigDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "node",
    workspace: [
      {
        extends: true,
        test: {
          environment: "jsdom",
        },
      },
    ],
    setupFiles: [
      "dotenv/config",
      "@repo/test-config/src/mongodb-setup.ts",
      "@repo/test-config/src/dom-setup.ts",
    ],
    globals: true,
    /**
     * Set this to one only so that MongoDB memory server can
     * run without being flaky https://github.com/shelfio/jest-mongodb/issues/366
     */
    maxWorkers: process.env.CI === "true" ? 1 : undefined,
    minWorkers: process.env.CI === "true" ? 1 : undefined,
    coverage: {
      provider: "v8",
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/.storybook/**",
        "**/*.stories.*",
        "**/storybook-static/**",
      ],
      reporter: ["json", "text", "lcov", "html"],
    },
  },
})
