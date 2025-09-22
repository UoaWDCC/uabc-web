import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config.js"

export const backendConfig = mergeConfig(baseConfig, {
  test: {
    environment: "node",
    setupFiles: ["@repo/test-config/setups/mongodb"],
    globalSetup: ["@repo/test-config/setups/global-setup"],
    globalTeardown: ["@repo/test-config/setups/global-teardown"],
    // Use single worker in CI or when testing transactions to avoid race conditions
    maxWorkers:
      // Force single worker to avoid MongoDB lock contention
      process.env.CI === "true" || process.env.TEST_TRANSACTIONS === "true" ? 1 : 1,
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
