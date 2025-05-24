import { Image, ui } from "@yamada-ui/react"
import type { ImageProps } from "./Image.types"

export const ImageBase = ui<typeof Image, ImageProps>(Image, {
  disableStyleProp: (prop) => ["fill", "height", "width"].includes(prop),
})
