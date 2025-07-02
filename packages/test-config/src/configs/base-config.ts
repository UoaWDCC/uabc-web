import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import { coverageConfigDefaults, defineConfig } from "vitest/config"

export const baseConfig = defineConfig({
  plugins: [tsconfigPaths(), react({ tsDecorators: true })],
  test: {
    setupFiles: ["dotenv/config"],
    globals: true,
    maxWorkers: process.env.CI === "true" ? 1 : undefined,
    coverage: {
      reportOnFailure: true,
      provider: "istanbul",
      thresholds: {
        branches: 60, // this is for overall vitest coverage report
        functions: 80,
        lines: 70,
        statements: 70,
      },
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
