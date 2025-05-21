import fs from "node:fs"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import { coverageConfigDefaults, defaultExclude, defineConfig } from "vitest/config"

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
      "apps/backend/src/test-config/vitest.setup.ts",
    ],
    globals: true,
    /**
     * Set this to one only so that MongoDB memory server can
     * run without being flaky https://github.com/shelfio/jest-mongodb/issues/366
     */
    maxWorkers: process.env.CI === "true" ? 1 : undefined,
    minWorkers: process.env.CI === "true" ? 1 : undefined,
    exclude: [...defaultExclude, "apps/portal/**"],
    coverage: {
      provider: "istanbul",
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/.storybook/**",
        "**/*.{stories,config}.*",
        "**/storybook-static/**",
        "**/*.{mjs,js}",
        "packages/(?!ui)/**",
        "**/*test-*/**",
        "apps/portal/**",
        ...(fs.readFileSync(`${__dirname}/.gitignore`, "utf8") || "")
          .split(/\r?\n/)
          .filter((line: string) => !!line.trim())
          .map((line: string) => `**/${line.trim()}**`),
      ],
      reporter: ["json", "text", "lcov", "html", "text-summary", "json-summary"],
      reportOnFailure: true,
    },
  },
})
