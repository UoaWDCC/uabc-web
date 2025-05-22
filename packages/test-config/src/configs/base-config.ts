import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import { coverageConfigDefaults, defaultExclude, defineConfig } from "vitest/config"

export const baseConfig = defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    setupFiles: ["dotenv/config", "@repo/test-config/setups/dom"],
    globals: true,
    maxWorkers: process.env.CI === "true" ? 1 : undefined,
    minWorkers: process.env.CI === "true" ? 1 : undefined,
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
      ],
      reporter: ["json", "text", "lcov", "html", "text-summary", "json-summary"],
    },
  },
})
