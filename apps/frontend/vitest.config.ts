import { frontendConfig } from "@repo/test-config/frontend"
import { mergeConfig } from "vitest/config"

export default mergeConfig(frontendConfig, {
  test: {
    setupFiles: ["./src/test-config/vitest.setup.tsx"],
  },
})
