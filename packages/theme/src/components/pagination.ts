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
      cursor: "pointer",
      fontWeight: { base: "normal", md: "semibold" },
      transitionDuration: "slower",
      transitionProperty: "common",
      aspectRatio: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      h: "auto",
      _disabled: {
        boxShadow: "none",
        cursor: "not-allowed",
        opacity: 0.4,
      },
      _focus: {
        outline: "none",
      },
      _hover: {
        _disabled: {
          bg: ["initial", "initial"],
        },
      },
      _readOnly: {
        cursor: "default",
        _ripple: {
          display: "none",
        },
      },
    },
    last: {},
    next: {},
    prev: {},
  },

  variants: {
    ghost: ({
      colorScheme: c = "gray",
      colorMode: m,
      errorBorderColor = ["danger.500", "danger.400"],
      theme: t,
    }) => ({
      item: {
        bg: "transparent",
        color: isGray(c) ? ["blackAlpha.800", "whiteAlpha.700"] : [`${c}.600`, `${c}.500`],
        vars: [
          {
            name: "errorBorderColor",
            token: "colors",
            value: errorBorderColor,
          },
        ],
        _focusVisible: {
          borderColor: "transparent",
          boxShadow: "outline",
        },
        _hover: {
          bg: [`${c}.50`, transparentizeColor(`${c}.600`, 0.12)(t, m)],
        },
        _selected: {
          bg: isGray("primary") ? undefined : "transparent",
          color: isGray("primary")
            ? ["blackAlpha.800", "whiteAlpha.700"]
            : ["primary.600", "primary.500"],
          fontWeight: "semibold",
        },
        _invalid: {
          border: "1px solid",
          borderColor: "$errorBorderColor",
          boxShadow: "0 0 0 1px $errorBorderColor",
        },
      },
    }),
    link: ({ colorScheme: c = "gray" }) => ({
      item: {
        color: [`${c}.600`, `${c}.500`],
        height: "auto",
        lineHeight: "normal",
        minW: "auto",
        padding: 0,
        verticalAlign: "baseline",
        _active: {
          color: [`${c}.700`, `${c}.600`],
          _disabled: {
            color: [`${c}.600`, `${c}.500`],
          },
        },
        _focusVisible: {
          boxShadow: "outline",
        },
        _hover: {
          textDecoration: "underline",
          _disabled: {
            textDecoration: "none",
          },
        },
        _ripple: {
          display: "none",
        },
      },
    }),
    outline: ({
      colorScheme: c = "gray",
      colorMode: m,
      errorBorderColor = ["danger.500", "danger.400"],
      theme: t,
    }) => ({
      item: {
        bg: "transparent",
        border: "1px solid",
        borderColor: [`${c}.600`, `${c}.500`],
        color: isGray(c) ? ["blackAlpha.800", "whiteAlpha.700"] : [`${c}.600`, `${c}.500`],
        vars: [
          {
            name: "errorBorderColor",
            token: "colors",
            value: errorBorderColor,
          },
        ],
        _focusVisible: {
          boxShadow: "outline",
          _invalid: {
            borderColor: "transparent",
          },
        },
        _hover: {
          bg: [`${c}.50`, transparentizeColor(`${c}.600`, 0.12)(t, m)],
        },
        _selected: {
          bg: "transparent",
          borderColor: ["primary.600", "primary.500"],
          color: isGray("primary")
            ? ["blackAlpha.800", "whiteAlpha.700"]
            : ["primary.600", "primary.500"],
        },
        _invalid: {
          borderColor: ["$errorBorderColor", "$errorBorderColor"],
          boxShadow: "0 0 0 1px $errorBorderColor",
        },
      },
    }),
    solid: ({ colorScheme: c = "gray", errorBorderColor = ["danger.500", "danger.400"] }) => ({
      item: {
        bg: isGray(c)
          ? [`${c}.50`, `${c}.700`]
          : c === "primary"
            ? [isAccessible(c) ? `${c}.300` : `${c}.400`, `${c}.500`]
            : c === "secondary"
              ? [isAccessible(c) ? `${c}.600` : `${c}.700`, `${c}.800`]
              : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
        backdropFilter: "blur(15px)",
        borderRadius: "12px",
        boxShadow:
          "0px 1.5px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.10)",
        color: [isGray(c) || isAccessible(c) ? "black" : "white", "white"],
        vars: [
          {
            name: "errorBorderColor",
            token: "colors",
            value: errorBorderColor,
          },
        ],
        layerStyle: "gradientBorder",
        _focusVisible: {
          borderColor: "transparent",
          boxShadow: "outline",
        },
        _hover: {
          bg: isGray(c)
            ? [`${c}.100`, `${c}.800`]
            : c === "primary"
              ? [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`]
              : c === "secondary"
                ? [isAccessible(c) ? `${c}.700` : `${c}.800`, `${c}.900`]
                : [isAccessible(c) ? `${c}.500` : `${c}.600`, `${c}.700`],
          _disabled: {
            bg: isGray(c)
              ? [`${c}.50`, `${c}.700`]
              : c === "primary"
                ? [isAccessible(c) ? `${c}.300` : `${c}.400`, `${c}.500`]
                : c === "secondary"
                  ? [isAccessible(c) ? `${c}.600` : `${c}.700`, `${c}.800`]
                  : [isAccessible(c) ? `${c}.400` : `${c}.500`, `${c}.600`],
          },
        },
        _selected: {
          bg: isGray("primary")
            ? ["primary.50", "primary.700"]
            : [isAccessible("primary") ? "primary.300" : "primary.400", "primary.500"],
          borderColor: isGray("primary")
            ? ["primary.50", "primary.700"]
            : [isAccessible("primary") ? "primary.300" : "primary.400", "primary.500"],
          color: [isGray("primary") || isAccessible("primary") ? "black" : "white", "white"],
        },
        _invalid: {
          border: "1px solid",
          borderColor: "$errorBorderColor",
          boxShadow: "0 0 0 1px $errorBorderColor",
        },
      },
    }),
    gradient: ({ colorScheme: c = "primary" }) => ({
      item: {
        backdropFilter: "blur(15px)",
        bgGradient: `${c}Gradient`,
        bgSize: "100% 100%",
        borderRadius: "12px",
        boxShadow:
          "0px 1.5px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.10)",
        color: "white",
        transition: "all 0.5s ease-in-out",
        layerStyle: "gradientBorder",
        _hover: {
          bgSize: "250% 100%",
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
        display: "inline",
        lineHeight: "inherit",
        m: 0,
        p: 0,
        height: "initial",
        width: "initial",
        minW: "initial",
        _ripple: {
          display: "none",
        },
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
        h: 6,
        lineHeight: "$sizes.6",
        minW: 6,
        px: 2,
        rounded: "sm",
      },
    },
    sm: {
      inner: {
        gap: "xs",
      },
      item: {
        fontSize: "sm",
        h: 8,
        lineHeight: "$sizes.8",
        minW: 8,
        px: 3,
        rounded: "md",
      },
    },
    md: {
      inner: {
        gap: "sm",
      },
      item: {
        fontSize: "md",
        h: 10,
        lineHeight: "$sizes.10",
        minW: 10,
        px: 4,
        rounded: "md",
      },
    },
    lg: {
      inner: {
        gap: "sm",
      },
      item: {
        fontSize: "lg",
        h: 12,
        lineHeight: "$sizes.12",
        minW: 12,
        px: 6,
        rounded: "md",
      },
    },
    xl: {
      inner: {
        gap: "md",
      },
      item: {
        fontSize: "xl",
        h: 14,
        lineHeight: "$sizes.14",
        minW: 14,
        px: 8,
        rounded: "lg",
      },
    },
    "2xl": {
      inner: {
        gap: "md",
      },
      item: {
        fontSize: "xl",
        h: 16,
        lineHeight: "$sizes.16",
        minW: 16,
        px: 10,
        rounded: "lg",
      },
    },
  },

  defaultProps: {
    colorScheme: "secondary",
    size: "md",
    variant: "solid",
  },
}
