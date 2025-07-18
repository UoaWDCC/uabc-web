import type { StorybookConfig } from "@storybook/nextjs"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "storybook-dark-mode",
    "@storybook/addon-queryparams",
  ],
  core: { disableTelemetry: true },
  framework: "@storybook/nextjs",
  staticDirs: ["../../../apps/frontend/public"],
}
export default config
