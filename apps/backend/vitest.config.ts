import { backendConfig } from "@repo/test-config/backend"
import { mergeConfig } from "vitest/config"

export default mergeConfig(backendConfig, {
  test: {
    // You can add backend-specific overrides here
    setupFiles: ["./src/test-config/vitest.setup.ts"],
    coverage: {
      exclude: [
        "**/test-config/**",
        "**/app/layout.tsx",
        "**/app/payload/**",
        "**/app/[[...segments]]/**",
        "**/app/importMap.js",
      ],
    },
  },
})
