import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config.js"

export const backendConfig = mergeConfig(baseConfig, {
  test: {
    environment: "node",
    setupFiles: ["@repo/test-config/setups/mongodb"],
  },
})
