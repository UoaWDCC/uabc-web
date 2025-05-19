import baseConfig from "@repo/test-config/vitest.config.base"
import { mergeConfig } from "vitest/config"

export default mergeConfig(baseConfig, {
  test: {
    // add any frontend-specific overrides here
  },
})
