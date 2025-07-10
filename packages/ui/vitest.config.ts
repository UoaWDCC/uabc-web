import { uiConfig } from "@repo/test-config/ui"
import { mergeConfig } from "vitest/config"

export default mergeConfig(uiConfig, {
  test: {
    coverage: {
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 80,
        lines: 90,
      },
    },
  },
})
