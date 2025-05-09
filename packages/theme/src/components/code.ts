import type { ComponentStyle } from "@yamada-ui/core"
import { isAccessible, isGray, shadeColor, tintColor } from "@yamada-ui/utils"

export const Code: ComponentStyle<"Code"> = {
  baseStyle: {
    alignItems: "center",
    display: "inline-flex",
    fontFamily: "mono",
    rounded: "md",
  },

  variants: {
    outline: ({ colorScheme: c = "primary" }) => ({
      boxShadow: "inset 0 0 0px 1px $color",
      color: "$color",
      vars: [
        {
          name: "color",
          token: "colors",
          value: [`${c}.600`, isGray(c) ? `${c}.300` : `${c}.500`],
        },
      ],
    }),
    solid: ({ colorScheme: c = "primary" }) => ({
      bg: isGray(c)
        ? [`${c}.50`, `${c}.700`]
        : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
      color: [isGray(c) || isAccessible(c) ? "black" : "white", "white"],
    }),
    subtle: ({ colorScheme: c = "primary", colorMode: m, theme: t }) => ({
      bg: [
        isGray(c) ? tintColor(`${c}.50`, 36)(t, m) : `${c}.50`,
        shadeColor(`${c}.300`, 68)(t, m),
      ],
      color: [`${c}.800`, isGray(c) ? `${c}.50` : `${c}.200`],
    }),
    surface: ({ colorScheme: c = "primary", colorMode: m, theme: t }) => ({
      bg: [
        isGray(c) ? tintColor(`${c}.50`, 36)(t, m) : `${c}.50`,
        shadeColor(`${c}.300`, 68)(t, m),
      ],
      boxShadow: "inset 0 0 0px 1px $color",
      color: [`${c}.800`, isGray(c) ? `${c}.50` : `${c}.200`],
      vars: [
        {
          name: "color",
          token: "colors",
          value: [`${c}.100`, shadeColor(`${c}.300`, 56)(t, m)],
        },
      ],
    }),
  },

  sizes: {
    xs: {
      fontSize: "2xs",
      lineHeight: "$sizes.4",
      minH: "4",
      px: "1",
    },
    sm: {
      fontSize: "xs",
      lineHeight: "$sizes.5",
      minH: "5",
      px: "1.5",
    },
    md: {
      fontSize: "sm",
      lineHeight: "$sizes.6",
      minH: "6",
      px: "2",
    },
    lg: {
      fontSize: "sm",
      lineHeight: "$sizes.7",
      minH: "7",
      px: "2.5",
    },
  },

  defaultProps: {
    colorScheme: "gray",
    size: "sm",
    variant: "subtle",
  },
}
