import { uiConfig } from "@repo/test-config/ui"
import { mergeConfig } from "vitest/config"

export default mergeConfig(uiConfig, {
  test: {
    coverage: {
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
})
