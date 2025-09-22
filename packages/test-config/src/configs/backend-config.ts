import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config.js"

export const backendConfig = mergeConfig(baseConfig, {
  test: {
    environment: "node",
    setupFiles: ["@repo/test-config/setups/mongodb"],
    globalSetup: ["@repo/test-config/setups/global-setup"],
    globalTeardown: ["@repo/test-config/setups/global-teardown"],
    maxWorkers: process.env.CI === "true" ? 1 : undefined,
    coverage: {
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
    },
  },
})
