import type { ComponentMultiStyle } from "@yamada-ui/core"
import { isAccessible, isGray, shadeColor, transparentizeColor } from "@yamada-ui/utils"

export const Pagination: ComponentMultiStyle<"Pagination"> = {
  baseStyle: {
    container: {
      _disabled: {
        cursor: "not-allowed",
      },
    },
    ellipsis: { border: "0", pointerEvents: "none" },
    first: {},
    inner: {},
    item: {
      color: ["blackAlpha.600", "whiteAlpha.700"],
      px: 1,
      transitionDuration: "slower",
      transitionProperty: "common",
      _active: {
        bg: ["blackAlpha.100", "whiteAlpha.100"],
      },
      _disabled: {
        boxShadow: "none",
        cursor: "not-allowed",
        opacity: 0.4,
      },
      _focus: {
        outline: "none",
      },
      _focusVisible: {
        boxShadow: "outline",
      },
      _hover: {
        bg: ["blackAlpha.50", "whiteAlpha.50"],
        _disabled: {
          bg: ["initial", "initial"],
        },
      },
      _selected: { cursor: "default", pointerEvents: "none" },
    },
    last: {},
    next: {},
    prev: {},
  },

  variants: {
    ghost: ({ colorScheme: c = "primary", colorMode: m, theme: t }) => {
      return {
        item: {
          _hover: {
            bg: [`${c}.50`, transparentizeColor(`${c}.600`, 0.12)(t, m)],
          },
          _selected: {
            bg: isGray(c) ? undefined : "transparent",
            color: isGray(c) ? ["blackAlpha.800", "whiteAlpha.700"] : [`${c}.600`, `${c}.500`],
            fontWeight: "semibold",
          },
        },
      }
    },
    outline: ({ colorScheme: c = "primary" }) => {
      return {
        item: {
          border: "1px solid",
          borderColor: "border",
          _selected: {
            bg: "transparent",
            borderColor: [`${c}.600`, `${c}.500`],
            color: isGray(c) ? ["blackAlpha.800", "whiteAlpha.700"] : [`${c}.600`, `${c}.500`],
          },
        },
      }
    },
    solid: ({ colorScheme: c = "primary" }) => ({
      item: {
        border: "1px solid",
        borderColor: "border",
        vars: [
          {
            name: "bg",
            token: "colors",
            value: isGray(c)
              ? [`${c}.50`, `${c}.700`]
              : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
          },
        ],
        _selected: {
          bg: "$bg",
          borderColor: "$bg",
          color: [isGray(c) || isAccessible(c) ? "black" : "white", "white"],
        },
      },
    }),
    subtle: ({ colorScheme: c = "primary", colorMode: m, theme: t }) => ({
      item: {
        _selected: {
          bg: [`${c}.50`, shadeColor(`${c}.300`, 68)(t, m)],
          color: [`${c}.800`, isGray(c) ? `${c}.50` : `${c}.200`],
        },
      },
    }),
    surface: ({ colorScheme: c = "primary", colorMode: m, theme: t }) => ({
      item: {
        border: "1px solid",
        borderColor: "border",
        _selected: {
          bg: [`${c}.50`, shadeColor(`${c}.300`, 68)(t, m)],
          borderColor: [`${c}.100`, shadeColor(`${c}.300`, 56)(t, m)],
          color: [`${c}.800`, isGray(c) ? `${c}.50` : `${c}.200`],
        },
      },
    }),
    unstyled: {
      inner: { gap: 0 },
      item: {
        bg: "none",
        color: "inherit",
        minH: "auto",
        minW: "auto",
        _ripple: { display: "none" },
      },
    },
  },

  sizes: {
    xs: {
      inner: {
        gap: "xs",
      },
      item: {
        fontSize: "xs",
        minH: 6,
        minW: 6,
        rounded: "sm",
      },
    },
    sm: {
      inner: {
        gap: "xs",
      },
      item: {
        fontSize: "sm",
        minH: 8,
        minW: 8,
        rounded: "md",
      },
    },
    md: {
      inner: {
        gap: "sm",
      },
      item: {
        fontSize: "md",
        minH: 10,
        minW: 10,
        rounded: "md",
      },
    },
    lg: {
      inner: {
        gap: "sm",
      },
      item: {
        fontSize: "lg",
        minH: 12,
        minW: 12,
        rounded: "md",
      },
    },
    xl: {
      inner: {
        gap: "md",
      },
      item: {
        fontSize: "xl",
        minH: 14,
        minW: 14,
        rounded: "lg",
      },
    },
  },

  defaultProps: {
    colorScheme: "primary",
    size: "sm",
    variant: "solid",
  },
}
