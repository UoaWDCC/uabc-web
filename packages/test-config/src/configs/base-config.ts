import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import { coverageConfigDefaults, defineConfig } from "vitest/config"

export const baseConfig = defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    setupFiles: ["dotenv/config"],
    globals: true,
    maxWorkers: process.env.CI === "true" ? 1 : undefined,
    minWorkers: process.env.CI === "true" ? 1 : undefined,
    coverage: {
      reportOnFailure: true,
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
      provider: "istanbul",
      exclude: [
        ...coverageConfigDefaults.exclude,
        "**/.storybook/**",
        "**/*.{stories,config}.*",
        "**/storybook-static/**",
        "**/*.{mjs,js}",
        "packages/(?!ui)/**",
        "**/*test-*/**",
      ],
      reporter: ["json", "text", "lcov", "html", "text-summary", "json-summary"],
    },
  },
})
