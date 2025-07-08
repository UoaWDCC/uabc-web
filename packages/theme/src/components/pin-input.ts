import type { ComponentMultiStyle } from "@yamada-ui/core"
import { mergeMultiStyle } from "@yamada-ui/core"
import { Input } from "./input"

export const PinInput: ComponentMultiStyle<"PinInput"> = mergeMultiStyle(Input, {
  baseStyle: {
    container: {
      gap: "2",
    },
    field: {
      textAlign: "center",
      bgGradient: "secondaryGradient",
    },
  },

  sizes: {
    xs: {
      field: {
        boxSize: "6",
        fontSize: "xs",
        rounded: "sm",
      },
    },
    sm: {
      field: {
        boxSize: "8",
        fontSize: "sm",
        rounded: "md",
      },
    },
    md: {
      field: {
        boxSize: "10",
        fontSize: "md",
        rounded: "md",
      },
    },
    lg: {
      field: {
        boxSize: "12",
        fontSize: "lg",
        rounded: "md",
      },
    },
  },

  variants: {
    unstyled: {
      field: {
        h: "auto",
      },
    },
    outline: {
      field: {
        borderColor: ["gray.300", "gray.600"],
        _focus: {
          borderColor: ["primary.500", "primary.400"],
          boxShadow: ["0 0 0 1px $colors.primary.500", "0 0 0 1px $colors.primary.400"],
        },
        _hover: {
          borderColor: ["gray.400", "gray.500"],
        },
        _invalid: {
          borderColor: ["danger.500", "danger.400"],
          _hover: {
            borderColor: ["danger.600", "danger.500"],
          },
          _focus: {
            borderColor: ["danger.500", "danger.400"],
            boxShadow: ["0 0 0 1px $colors.danger.500", "0 0 0 1px $colors.danger.400"],
          },
        },
      },
    },
  },
})({ omit: ["addon", "sizes"] })
