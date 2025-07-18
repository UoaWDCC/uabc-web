import type { ComponentMultiStyle } from "@yamada-ui/core"
import { mode } from "@yamada-ui/core"
import { getColor, isArray } from "@yamada-ui/utils"

export const Input: ComponentMultiStyle<"Input"> = {
  baseStyle: {
    container: {},
    element: {
      color: ["black", "white"],
    },
    field: {
      appearance: "none",
      minWidth: 0,
      outline: 0,
      position: "relative",
      transitionDuration: "normal",
      transitionProperty: "border-color, box-shadow, background-color, opacity",
      width: "100%",
      _disabled: {
        cursor: "not-allowed",
        opacity: 0.4,
      },
    },
  },

  sizes: {
    xs: {
      addon: {
        fontSize: "xs",
        minH: "6",
        px: "2",
        rounded: "sm",
      },
      field: {
        fontSize: "xs",
        minH: "6",
        px: "2",
        rounded: "sm",
      },
    },
    sm: {
      addon: {
        fontSize: "sm",
        minH: "8",
        px: "2",
        rounded: "md",
      },
      field: {
        fontSize: "sm",
        minH: "8",
        px: "2",
        rounded: "md",
      },
    },
    md: {
      addon: {
        fontSize: "md",
        minH: "10",
        px: "3",
        rounded: "md",
      },
      field: {
        fontSize: "md",
        minH: "10",
        px: "3",
        rounded: "md",
      },
    },
    lg: {
      addon: {
        fontSize: "lg",
        minH: "12",
        px: "4",
        rounded: "md",
      },
      field: {
        fontSize: "lg",
        minH: "12",
        px: "4",
        rounded: "md",
      },
    },
    xl: {
      addon: {
        fontSize: "xl",
        minH: "14",
        px: "4",
        rounded: "lg",
      },
      field: {
        fontSize: "xl",
        minH: "14",
        px: "4",
        rounded: "lg",
      },
    },
  },

  variants: {
    filled: ({
      colorMode: m,
      errorBorderColor: ec = ["danger.500", "danger.400"],
      focusBorderColor: fc = "focus",
      theme: t,
    }) => {
      const focusBorderColor = isArray(fc)
        ? mode(getColor(fc[0], fc[0])(t, m), getColor(fc[1], fc[1])(t, m))(m)
        : getColor(fc, fc)(t, m)
      const errorBorderColor = isArray(ec)
        ? mode(getColor(ec[0], ec[0])(t, m), getColor(ec[1], ec[1])(t, m))(m)
        : getColor(ec, ec)(t, m)

      return {
        addon: {
          bg: ["blackAlpha.300", "whiteAlpha.300"],
          border: "2px solid transparent",
        },
        field: {
          bg: ["blackAlpha.50", "whiteAlpha.50"],
          border: "2px solid",
          borderColor: "transparent",
          _active: {
            bg: "transparent",
            borderColor: focusBorderColor,
            boxShadow: `0 0 0 1px ${focusBorderColor}`,
          },
          _focusVisible: {
            bg: "transparent",
            borderColor: focusBorderColor,
            boxShadow: `0 0 0 1px ${focusBorderColor}`,
          },
          _hover: {
            bg: ["blackAlpha.100", "whiteAlpha.100"],
          },
          _invalid: {
            borderColor: errorBorderColor,
            boxShadow: `0 0 0 1px ${errorBorderColor}`,
          },
          _readOnly: {
            boxShadow: "none !important",
            userSelect: "all",
          },
        },
      }
    },
    flushed: ({
      colorMode: m,
      errorBorderColor: ec = ["danger.500", "danger.400"],
      focusBorderColor: fc = "focus",
      theme: t,
    }) => {
      const focusBorderColor = isArray(fc)
        ? mode(getColor(fc[0], fc[0])(t, m), getColor(fc[1], fc[1])(t, m))(m)
        : getColor(fc, fc)(t, m)
      const errorBorderColor = isArray(ec)
        ? mode(getColor(ec[0], ec[0])(t, m), getColor(ec[1], ec[1])(t, m))(m)
        : getColor(ec, ec)(t, m)

      return {
        addon: {
          bg: "transparent",
          borderBottom: "1px solid",
          borderColor: "inherit",
          rounded: "0",
        },
        field: {
          bg: "transparent",
          borderBottom: "1px solid",
          borderColor: "inherit",
          px: "0",
          rounded: "0",
          _active: {
            borderColor: [focusBorderColor, focusBorderColor],
            boxShadow: `0px 1px 0px 0px ${focusBorderColor}`,
          },
          _focusVisible: {
            borderColor: [focusBorderColor, focusBorderColor],
            boxShadow: `0px 1px 0px 0px ${focusBorderColor}`,
          },
          _hover: {
            borderColor: ["blackAlpha.500", "whiteAlpha.400"],
          },
          _invalid: {
            borderColor: [errorBorderColor, errorBorderColor],
            boxShadow: `0px 1px 0px 0px ${errorBorderColor}`,
          },
          _readOnly: {
            boxShadow: "none !important",
            userSelect: "all",
          },
        },
      }
    },
    outline: ({
      colorMode: m,
      errorBorderColor: ec = ["danger.500", "danger.400"],
      focusBorderColor: fc = "focus",
      theme: t,
    }) => {
      const focusBorderColor = isArray(fc)
        ? mode(getColor(fc[0], fc[0])(t, m), getColor(fc[1], fc[1])(t, m))(m)
        : getColor(fc, fc)(t, m)
      const errorBorderColor = isArray(ec)
        ? mode(getColor(ec[0], ec[0])(t, m), getColor(ec[1], ec[1])(t, m))(m)
        : getColor(ec, ec)(t, m)

      return {
        addon: {
          bg: ["blackAlpha.300", "whiteAlpha.300"],
          border: "1px solid",
          borderColor: ["inherit", "whiteAlpha.50"],
        },
        field: {
          bg: "inherit",
          border: "1px solid",
          borderColor: "inherit",
          _active: {
            borderColor: [focusBorderColor, focusBorderColor],
            boxShadow: `0 0 0 1px ${focusBorderColor}`,
          },
          _focusVisible: {
            borderColor: [focusBorderColor, focusBorderColor],
            boxShadow: `0 0 0 1px ${focusBorderColor}`,
            zIndex: "yamcha",
          },
          _hover: {
            borderColor: ["blackAlpha.500", "whiteAlpha.400"],
          },
          _invalid: {
            borderColor: [errorBorderColor, errorBorderColor],
            boxShadow: `0 0 0 1px ${errorBorderColor}`,
          },
          _readOnly: {
            boxShadow: "none !important",
            userSelect: "all",
          },
        },
      }
    },
    unstyled: {
      addon: {
        bg: "transparent",
        minH: "auto",
        px: "0",
      },
      field: {
        bg: "transparent",
        minH: "auto",
        px: "0",
      },
    },
    gradient: ({
      colorMode: m,
      colorScheme: cs = "secondary",
      errorBorderColor: ec = ["danger.500", "danger.400"],
      focusBorderColor: fc = ["primary.500", "primary.400"],
      bgGradient: bg = undefined,
      theme: t,
    }) => {
      const focusBorderColor = isArray(fc)
        ? mode(getColor(fc[0], fc[0])(t, m), getColor(fc[1], fc[1])(t, m))(m)
        : getColor(fc, fc)(t, m)
      const errorBorderColor = isArray(ec)
        ? mode(getColor(ec[0], ec[0])(t, m), getColor(ec[1], ec[1])(t, m))(m)
        : getColor(ec, ec)(t, m)
      return {
        field: {
          bgGradient: bg || `${cs}Gradient`,
          border: "1px solid",
          borderColor: ["gray.300", "gray.600"],
          borderRadius: "md",
          fontSize: "md",
          h: "10",
          _focus: {
            borderColor: [focusBorderColor, focusBorderColor],
            boxShadow: [
              `0 0 0 1px $colors.${Array.isArray(fc) ? fc[0] : fc}`,
              `0 0 0 1px $colors.${Array.isArray(fc) ? fc[1] : fc}`,
            ],
          },
          _hover: {
            borderColor: ["gray.400", "gray.500"],
          },
          _invalid: {
            borderColor: [errorBorderColor, errorBorderColor],
            _hover: {
              borderColor: ["danger.600", "danger.500"],
            },
            _focus: {
              borderColor: [errorBorderColor, errorBorderColor],
              boxShadow: ["0 0 0 1px $colors.danger.500", "0 0 0 1px $colors.danger.400"],
            },
          },
        },
      }
    },
  },

  defaultProps: {
    size: "lg",
    variant: "outline",
  },
}
