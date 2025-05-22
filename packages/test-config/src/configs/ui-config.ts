import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config.js"

export const uiConfig = mergeConfig(baseConfig, {
  test: {
    environment: "jsdom",
    setupFiles: ["@repo/test-config/setups/dom"],
  },
  coverage: {
    thresholds: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
})
