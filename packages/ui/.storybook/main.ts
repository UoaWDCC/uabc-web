import type { StorybookConfig } from "@storybook/nextjs"

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-viewport",
    "@storybook/addon-controls",
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
