import { type ComponentMultiStyle, mergeMultiStyle, mode } from "@yamada-ui/core"
import { getColor, isArray } from "@yamada-ui/utils"
import { Menu } from "./menu"
import { NativeSelect } from "./native-select"

export const Select: ComponentMultiStyle<"Select"> = mergeMultiStyle(NativeSelect, Menu, {
  baseStyle: {
    container: ({ colorScheme: _c = "secondary" }) => ({
      borderRadius: "md",
      bg: [`${_c}.50`, `${_c}.900`],
    }),
    content: ({ colorScheme: c = "secondary" }) => ({
      w: "100%",
      bg: [`${c}.50`, `${c}.900`],
    }),
    footer: {},
    header: {},
    inner: ({ colorScheme: _c = "secondary" }) => ({
      rounded: "md",
    }),
    item: {
      _active: {
        bg: ["blackAlpha.200", "whiteAlpha.200"],
      },
      _hover: {
        bg: ["blackAlpha.100", "whiteAlpha.100"],
        _disabled: {
          bg: ["white", "black"],
        },
        _focus: {
          bg: ["blackAlpha.50", "whiteAlpha.50"],
        },
      },
    },
    itemIcon: {},
    list: {
      maxH: "xs",
      overflowY: "auto",
    },
  },

  variants: {
    stylised: ({
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
        container: {
          bg: [`${cs}.50`, `${cs}.900`],
        },
        field: {
          bgGradient: bg || "heroGradient",
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

  sizes: {
    lg: {
      field: {
        "&[data-has-icon='true']": {
          pl: "$sizes.12",
          pr: "4",
        },
      },
      icon: {
        pr: "$sizes.2",
      },
    },
  },
  defaultProps: {
    size: "lg",
    variant: "gradient",
  },
})({ omit: ["button", "command"] })
