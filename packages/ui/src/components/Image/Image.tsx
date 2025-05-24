import NextImage from "next/image"
import { forwardRef } from "react"
import type { ImageProps } from "./Image.types"
import { ImageBase } from "./ImageBase"

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  return <ImageBase as={NextImage} ref={ref} {...props} />
})

Image.displayName = "Image"
