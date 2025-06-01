import type { ComponentStyle } from "@yamada-ui/core"
import { isAccessible, isGray, transparentizeColor } from "@yamada-ui/utils"

export const Button: ComponentStyle<"Button"> = {
  baseStyle: {
    cursor: "pointer",
    fontSize: {
      base: "1rem",
      sm: "1.125rem",
    },
    fontWeight: "semibold",
    height: {
      base: "3rem",
      sm: "3.625rem",
    },
    padding: {
      base: "1rem",
      sm: "0.375rem 1.25rem",
    },
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
      _before: {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        border: "1.5px solid transparent",
        background:
          "linear-gradient(15deg, rgba(255, 255, 255, 0.00) 33.61%, #FFFFFF 89.19%) border-box, rgba(255, 255, 255, 0.2) border-box",
        mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        mixBlendMode: "overlay",
        pointerEvents: "none",
      },
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
    gradient: ({ colorScheme: c = "primary" }) => ({
      backdropFilter: "blur(15px)",
      bgGradient: `${c}Gradient`,
      bgSize: "100% 100%",
      borderRadius: "12px",
      boxShadow:
        "0px 1.5px 0px rgba(0, 0, 0, 0.05), 0px 6px 6px rgba(0, 0, 0, 0.05), 0px 15px 15px 0px rgba(0, 0, 0, 0.10)",
      color: "white",
      transition: "all 0.5s ease-in-out",
      _before: {
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        border: "1.5px solid transparent",
        background:
          "linear-gradient(35deg, rgba(255, 255, 255, 0.00) 33.61%, #FFFFFF 89.19%) border-box, rgba(255, 255, 255, 0.07) border-box",
        mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        mixBlendMode: "overlay",
        pointerEvents: "none",
      },
      _hover: {
        bgSize: "250% 100%",
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
      height: "auto",
      lineHeight: "$sizes.8",
      minW: 24,
      px: 7.5,
      py: 2,
      rounded: "xl",
    },
    md: {
      fontSize: "sm",
      height: "auto",
      lineHeight: "$sizes.10",
      minW: "10.4375rem",
      px: 7.5,
      py: 4,
      rounded: "xl",
    },
    lg: {
      fontSize: "lg",
      height: "auto",
      lineHeight: "$sizes.12",
      minW: "13.75rem",
      px: 5,
      py: 3.5,
      rounded: "xl",
    },
    xl: {
      fontSize: "lg",
      height: "auto",
      lineHeight: "$sizes.14",
      minW: "23.125rem",
      px: 5,
      py: 3.5,
      rounded: "xl",
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
    colorScheme: "gray",
    size: "md",
    variant: "solid",
  },
}

export const BUTTON_VARIANTS = Object.keys(Button.variants || {})
