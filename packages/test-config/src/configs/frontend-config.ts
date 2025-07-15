import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config.js"

export const frontendConfig = mergeConfig(baseConfig, {
  test: {
    environment: "jsdom",
    setupFiles: ["@repo/test-config/setups/dom"],
    coverage: {
      thresholds: {
        branches: 0, // TODO: Set appropriate thresholds
        functions: 0,
        lines: 0,
        statements: 0,
      },
      exclude: ["**/services/**"],
    },
  },
})
