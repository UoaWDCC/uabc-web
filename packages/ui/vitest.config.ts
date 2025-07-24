import { uiConfig } from "@repo/test-config/configs"
import { mergeConfig } from "vitest/config"

export default mergeConfig(uiConfig, {
  test: {
    setupFiles: ["./src/test-config/vitest.setup.ts"],
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
