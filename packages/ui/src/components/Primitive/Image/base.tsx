"use client"
import { Image, ui } from "@yamada-ui/react"
import type { ImageProps } from "./types"

/**
 * Base image component using Yamada UI's `ui` utility for style prop management.
 *
 * @remarks
 * Used internally by the custom Image component to merge Next.js and Yamada UI features.
 * Disables style props that conflict with Next.js Image (fill, height, width).
 */
export const ImageBase = ui<typeof Image, ImageProps>(Image, {
  disableStyleProp: (prop) => ["fill", "height", "width"].includes(prop),
})
