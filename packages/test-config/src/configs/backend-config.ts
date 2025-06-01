import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config.js"

export const backendConfig = mergeConfig(baseConfig, {
  test: {
    environment: "node",
    setupFiles: ["@repo/test-config/setups/mongodb"],
    coverage: {
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
      exclude: [
        "**/payload/**", // Exclude Payload CMS files
        "**/admin/**",
        "**/api/payload/**",
      ],
    },
  },
})
