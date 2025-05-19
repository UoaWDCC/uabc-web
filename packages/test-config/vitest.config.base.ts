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
    setupFiles: ["dotenv/config", "@repo/test-config/src/dom-setup.ts"],
    globals: true,
    maxWorkers: process.env.CI === "true" ? 1 : undefined,
    minWorkers: process.env.CI === "true" ? 1 : undefined,
    exclude: [...defaultExclude, "apps/portal/**"],
    coverage: {
      provider: "istanbul",
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/.storybook/**",
        "**/*.{stories,config}.*",
        "**/storybook-static/**",
        "**/*.{mjs,js}",
        "packages/(?!ui)/**",
        "**/*test-*/**",
        "apps/portal/**",
      ],
      reporter: ["json", "text", "lcov", "html", "text-summary"],
    },
  },
})
