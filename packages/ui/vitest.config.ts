import { uiConfig } from "@repo/test-config/ui"
import { mergeConfig } from "vitest/config"

export default mergeConfig(uiConfig, {
  test: {
    coverage: {
      thresholds: {
        statements: 65,
        branches: 65,
        functions: 65,
        lines: 65,
      },
    },
  },
})
