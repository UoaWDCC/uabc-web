import { defaultTheme } from "@repo/theme"
import { themes } from "@storybook/theming"
import type { BaseTheme } from "@yamada-ui/react"

const fonts = defaultTheme.fonts as BaseTheme["fonts"]
const colors = defaultTheme.colors as Record<string, Record<string, string>>

const sharedTheme = {
  appBorderRadius: 0,
  barSelectedColor: colors.blue[500],
  // brandTitle: 'UABC',
  brandTitle: `<div style="display: flex; align-items: center; gap: 0.5rem;"><img src="https://raw.githubusercontent.com/UoaWDCC/uabc-web/refs/heads/master/apps/frontend/public/svgs/logo.svg" width="20px" height="20px"/> UABC</div>`,
  brandUrl: "https://wdcc-uabc-staging.fly.dev",
  // If prefer image over title
  // brandImage:
  //   "https://raw.githubusercontent.com/UoaWDCC/uabc-web/refs/heads/master/public/svgs/logo.svg",
  colorPrimary: colors.blue[500],
  colorSecondary: colors.secondary[500],
  fontBase: fonts.body,
  fontCode: fonts.mono,
}

export const customThemes = {
  light: {
    ...themes.light,
    ...sharedTheme,
    base: "light",
    appBg: colors.white,
    appContentBg: colors.white,
    barBg: colors.white,
    barTextColor: colors.secondary[500],
    textColor: colors.black,
    textInverseColor: colors.black,
  },
  dark: {
    ...themes.dark,
    ...sharedTheme,
    base: "dark",
    appBg: colors.black,
    appContentBg: colors.black,
    barBg: colors.black,
    barTextColor: colors.secondary[500],
    textColor: colors.white,
    textInverseColor: colors.white,
  },
}
