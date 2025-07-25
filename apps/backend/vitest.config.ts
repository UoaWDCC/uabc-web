import { backendConfig } from "@repo/test-config/backend"
import { mergeConfig } from "vitest/config"

export default mergeConfig(backendConfig, {
  test: {
    // You can add backend-specific overrides here
    setupFiles: ["./src/test-config/vitest.setup.ts"],
    coverage: {
      exclude: [
        "src/test-config/**",
        "src/app/layout.tsx",
        "src/app/payload/**",
        "src/app/[[...segments]]/**",
        "src/app/importMap.js",
      ],
    },
  },
})
