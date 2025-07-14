import type { ComponentMultiStyle } from "@yamada-ui/core"
import { mergeMultiStyle } from "@yamada-ui/core"
import { Menu } from "./menu"
import { NativeSelect } from "./native-select"

export const Select: ComponentMultiStyle<"Select"> = mergeMultiStyle(NativeSelect, Menu, {
  baseStyle: {
    container: ({ colorScheme: c = "secondary" }) => ({
      bg: [`${c}.50`, `${c}.900`],
      borderRadius: "md",
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
})({ omit: ["button", "command"] })
