import NextImage from "next/image"
import { forwardRef } from "react"
import type { ImageProps } from "./Image.types"
import { ImageBase } from "./ImageBase"

/**
 * Generic Image component that combines Next.js Image and Yamada UI Image features.
 *
 * @param props - Combined Next.js and Yamada UI Image props
 * @param ref - Forwarded ref for the underlying image element
 * @returns A styled image component supporting both Next.js and Yamada UI features
 *
 * @example
 * <Image src="/logo.png" alt="Logo" width={100} height={100} />
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  return <ImageBase as={NextImage} ref={ref} {...props} />
})

Image.displayName = "Image"
