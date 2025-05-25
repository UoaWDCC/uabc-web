import { uiConfig } from "@repo/test-config/ui"
import { mergeConfig } from "vitest/config"

export default mergeConfig(uiConfig, {
  test: {
    coverage: {
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    setupFiles: ["./src/test-config/vitest.setup.tsx"],
  },
})
