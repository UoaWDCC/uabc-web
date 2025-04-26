import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    {
      name: "@storybook/addon-essentials",
      options: {
        docs: false,
      },
    },
    "@storybook/addon-viewport",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-backgrounds",
    "@storybook/addon-measure",
    "@storybook/addon-storysource",
    "storybook-dark-mode",
  ],
  core: { disableTelemetry: true },
  framework: "@storybook/react-vite",
  staticDirs: ["../../../apps/frontend/public"],
}
export default config
