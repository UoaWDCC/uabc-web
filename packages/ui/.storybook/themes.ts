import { defaultTheme } from "@repo/theme"
import type { BaseTheme } from "@yamada-ui/react"
import { themes } from "storybook/theming"

const fonts = defaultTheme.fonts as BaseTheme["fonts"]
const colors = defaultTheme.colors as Record<string, Record<string, string>>

const sharedTheme = {
  appBorderRadius: 0,
  barSelectedColor: colors.primary,
  // TODO: Change link to frontend folder once
  brandTitle: `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <img src="https://raw.githubusercontent.com/UoaWDCC/uabc-web/refs/heads/master/apps/portal/public/svgs/logo.svg" width="20px" height="20px"/>
      UABC
    </div>
  `,
  brandUrl: "https://wdcc-uabc-staging.fly.dev",
  // If prefer image over title
  // brandImage:
  //   "https://raw.githubusercontent.com/UoaWDCC/uabc-web/refs/heads/master/public/svgs/logo.svg",
  colorPrimary: colors.primary,
  colorSecondary: colors.secondary,
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
    barTextColor: colors.secondary,
    textColor: colors.black,
    textInverseColor: colors.white,
  },
  dark: {
    ...themes.dark,
    ...sharedTheme,
    base: "dark",
    appBg: colors.black,
    appContentBg: colors.black,
    barBg: colors.black,
    barTextColor: colors.secondary,
    textColor: colors.white,
    textInverseColor: colors.black,
  },
}
