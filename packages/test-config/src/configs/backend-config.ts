import { mergeConfig } from "vitest/config"
import { baseConfig } from "./base-config"

export const backendConfig = mergeConfig(baseConfig, {
  test: {
    environment: "node",
    setupFiles: ["@repo/test-config/setups/mongodb"],
    maxWorkers: process.env.CI === "true" ? 1 : undefined,
    coverage: {
      thresholds: {
        branches: 50,
        functions: 50,
        lines: 50,
        statements: 50,
      },
      exclude: [
        "**/app/payload/**", // Exclude Payload CMS files
      ],
    },
  },
})
