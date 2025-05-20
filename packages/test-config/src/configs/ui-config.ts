import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config.js"

export const uiConfig = mergeConfig(baseConfig, {
  test: {
    environment: "jsdom",
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
