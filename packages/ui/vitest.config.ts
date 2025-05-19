import baseConfig from "@repo/test-config/vitest.config.base"
import { mergeConfig } from "vitest/config"

export default mergeConfig(baseConfig, {
  test: {
    coverage: {
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
