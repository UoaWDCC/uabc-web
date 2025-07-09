import { uiConfig } from "@repo/test-config/ui"
import { mergeConfig } from "vitest/config"

export default mergeConfig(uiConfig, {
  test: {
    coverage: {
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
})
