import baseConfig from "@repo/test-config/vitest.config.base"
import { mergeConfig } from "vitest/config"

export default mergeConfig(baseConfig, {
  test: {
    // You can add backend-specific overrides here
    setupFiles: ["@repo/test-config/src/mongodb-setup.ts", "./src/test-config/vitest.setup.ts"],
  },
})
