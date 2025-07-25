import type { ComponentStyle } from "@yamada-ui/core"
import { isAccessible, isGray, transparentizeColor } from "@yamada-ui/utils"
import { gradients } from "../tokens/gradients"

export const Button: ComponentStyle<"Button"> = {
  baseStyle: {
    cursor: "pointer",

    fontWeight: { base: "normal", md: "semibold" },
    transitionDuration: "slower",
    transitionProperty: "common",
    _disabled: {
      boxShadow: "none",
      cursor: "not-allowed",
      opacity: 0.4,
    },
    _focus: {
      outline: "none",
    },
    _readOnly: {
      cursor: "default",
      _ripple: {
        display: "none",
      },
    },
  },
  variants: {
    ghost: ({
      colorScheme: c = "gray",
      colorMode: m,
      errorBorderColor = ["danger.500", "danger.400"],
      theme: t,
    }) => ({
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
        _disabled: {
          bg: ["initial", "initial"],
        },
      },
      _invalid: {
        border: "1px solid",
        borderColor: "$errorBorderColor",
        boxShadow: "0 0 0 1px $errorBorderColor",
      },
    }),
    link: ({ colorScheme: c = "gray" }) => ({
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
          bg: ["initial", "initial"],
        },
      },
      _ripple: {
        display: "none",
      },
    }),
    outline: ({
      colorScheme: c = "gray",
      colorMode: m,
      errorBorderColor = ["danger.500", "danger.400"],
      theme: t,
    }) => ({
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
        _disabled: {
          bg: ["initial", "initial"],
        },
      },
      _invalid: {
        borderColor: ["$errorBorderColor", "$errorBorderColor"],
        boxShadow: "0 0 0 1px $errorBorderColor",
      },
    }),
    solid: ({ colorScheme: c = "gray", errorBorderColor = ["danger.500", "danger.400"] }) => ({
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
      _invalid: {
        border: "1px solid",
        borderColor: "$errorBorderColor",
        boxShadow: "0 0 0 1px $errorBorderColor",
      },
    }),
    gradient: ({
      colorScheme: c = "primary",
      errorBorderColor = ["danger.500", "danger.400"],
    }) => ({
      backdropFilter: "blur(15px)",
      bgGradient:
        `${c}Gradient` in gradients
          ? `${c}Gradient`
          : `linear-gradient(270deg, ${c}.500 16.5%, ${c}.700 105%)`,
      bgSize: "100% 100%",
      borderRadius: "12px",
      boxShadow:
        "0px 1.5px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.10)",
      color: "white",
      transition: "all 0.5s ease-in-out",
      layerStyle: "gradientBorder",
      vars: [
        {
          name: "errorBorderColor",
          token: "colors",
          value: errorBorderColor,
        },
      ],
      _hover: {
        bgSize: "250% 100%",
        _disabled: {
          bgSize: "100% 100%",
          bg: "transparent",
          bgGradient:
            `${c}Gradient` in gradients
              ? `${c}Gradient`
              : `linear-gradient(270deg, ${c}.500 16.5%, ${c}.700 105%)`,
        },
      },
      _focusVisible: {
        borderColor: "transparent",
        boxShadow: "outline",
      },
      _active: {
        bgSize: "300% 100%",
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
        boxShadow: "none",
      },
      _invalid: {
        border: "1px solid",
        borderColor: "$errorBorderColor",
        boxShadow: "0 0 0 1px $errorBorderColor",
      },
    }),
    unstyled: {
      bg: "none",
      color: "inherit",
      display: "inline",
      lineHeight: "inherit",
      m: 0,
      p: 0,
      height: "initial",
      width: "initial",
      _disabled: {
        bg: "none",
      },
      minW: "initial",
      _ripple: {
        display: "none",
      },
    },
  },
  sizes: {
    xs: {
      fontSize: "xs",
      h: 6,
      lineHeight: "$sizes.6",
      minW: 6,
      px: 2,
      rounded: "sm",
    },
    sm: {
      fontSize: "sm",
      h: 8,
      lineHeight: "$sizes.8",
      minW: 8,
      px: 3,
      rounded: "md",
    },
    md: {
      fontSize: "md",
      h: 10,
      lineHeight: "$sizes.10",
      minW: 10,
      px: 4,
      rounded: "md",
    },
    lg: {
      fontSize: "lg",
      h: 12,
      lineHeight: "$sizes.12",
      minW: 12,
      px: 6,
      rounded: "md",
    },
    xl: {
      fontSize: "xl",
      h: 14,
      lineHeight: "$sizes.14",
      minW: 14,
      px: 8,
      rounded: "lg",
    },
    "2xl": {
      fontSize: "xl",
      h: 16,
      lineHeight: "$sizes.16",
      minW: 16,
      px: 10,
      rounded: "lg",
    },
  },
  defaultProps: {
    colorScheme: "secondary",
    size: "md",
    variant: "solid",
  },
}

export const BUTTON_VARIANTS = Object.keys(Button.variants || {})
