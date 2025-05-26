import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config.js"

export const frontendConfig = mergeConfig(baseConfig, {
  test: {
    environment: "jsdom",
    setupFiles: ["@repo/test-config/setups/dom"],
  },
})
