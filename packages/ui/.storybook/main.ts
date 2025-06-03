import type { StorybookConfig } from "@storybook/nextjs"

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    /**
     * Note for reviewer: `@storybook/addon-essentials` has been removed and it's functionality
     * is now provided by individual addons like `@storybook/addon-actions`, `@storybook/addon-links`, etc.
     */
    "@storybook/addon-viewport",
    "@storybook/addon-controls",
    "@storybook/addon-interactions",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-backgrounds",
    "@storybook/addon-measure",
    "storybook-dark-mode",
  ],
  core: { disableTelemetry: true },
  framework: "@storybook/nextjs",
  staticDirs: ["../../../apps/frontend/public"],
}
export default config
