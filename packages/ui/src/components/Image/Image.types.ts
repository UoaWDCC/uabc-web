import type { HTMLUIProps, Merge, ThemeProps } from "@yamada-ui/react"
import type { ImageProps as NextImageProps } from "next/image"

/**
 * Status of the image loading process.
 *
 * - "pending": The image has not started loading yet.
 * - "loading": The image is currently loading.
 * - "loaded": The image has loaded successfully.
 * - "failed": The image failed to load.
 */
export type Status = "failed" | "loaded" | "loading" | "pending"

/**
 * Custom props for the internal NextImage wrapper, merging UI and Next.js props.
 */
export interface CustomNextImageProps
  extends Merge<HTMLUIProps<"img">, NextImageProps>,
    ThemeProps<"Image"> {}

/**
 * Props for the Image component.
 *
 * @remarks
 * Extends the base NextImageProps from @yamada-ui/next, with additional support for fallback images and fallback strategies.
 *
 * @property fallback - Optional fallback image source to display if the main image fails to load or before it loads, depending on the fallbackStrategy.
 * @property fallbackStrategy - Determines when to show the fallback image. "beforeLoadOrError" shows the fallback before the image loads or on error, while "onError" only shows it on error.
 */
export type ImageProps = Omit<NextImageProps, "fallback"> &
  CustomNextImageProps & {
    fallback?: string
    fallbackStrategy?: "beforeLoadOrError" | "onError"
  }
