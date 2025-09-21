import type { StorybookConfig } from "@storybook/nextjs-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "storybook-dark-mode",
    "@storybook/addon-queryparams",
  ],
  core: { disableTelemetry: true },
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../../../apps/frontend/public"],
  async viteFinal(config) {
    const { mergeConfig } = await import("vite")

    return mergeConfig(config, {
      server: {
        fs: {
          strict: false,
        },
      },
    })
  },
}
export default config
