"use client"
import type { HTMLUIProps, Merge, ThemeProps } from "@yamada-ui/react"
import {
  cx,
  isString,
  omitThemeProps,
  ui,
  useBoolean,
  useComponentStyle,
  useImage,
} from "@yamada-ui/react"
import type { StaticImageData } from "next/image"
import type { ImageProps as NextImageProps } from "next/image"
import NextImage from "next/image"
import { forwardRef, useCallback } from "react"

interface CustomNextImageProps
  extends Merge<HTMLUIProps<"img">, NextImageProps>,
    ThemeProps<"Image"> {}

const Component = ui<typeof NextImage, CustomNextImageProps>(NextImage, {
  disableStyleProp: (prop) => ["fill", "height", "width"].includes(prop),
})

const CustomNextImage = forwardRef<HTMLImageElement, CustomNextImageProps>((props, ref) => {
  const [css, mergedProps] = useComponentStyle("Image", props)
  const { className, ...rest } = omitThemeProps(mergedProps)

  return <Component __css={css} className={cx("ui-image", className)} ref={ref} {...rest} />
})

CustomNextImage.displayName = "CustomNextImage"

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

/**
 * Status of the image loading process.
 *
 * - "pending": The image has not started loading yet.
 * - "loading": The image is currently loading.
 * - "loaded": The image has loaded successfully.
 * - "failed": The image failed to load.
 */
type Status = "failed" | "loaded" | "loading" | "pending"

/**
 * Determines whether the fallback image should be shown based on the image status and fallback strategy.
 *
 * @param status - The current status of the image loading process.
 * @param fallbackStrategy - The strategy for when to show the fallback image.
 * @returns True if the fallback image should be shown, false otherwise.
 */
export const shouldShowFallbackImage = (
  status: Status,
  fallbackStrategy: "beforeLoadOrError" | "onError",
) =>
  (status !== "loaded" && fallbackStrategy === "beforeLoadOrError") ||
  (status === "failed" && fallbackStrategy === "onError")

/**
 * Generic Image component based on Yamada UI NextImage, with fallback support.
 *
 * @param props - Combined Yamada UI NextImage props and custom options for fallback handling.
 * @param ref - React ref forwarded to the underlying image element.
 * @returns A NextImage component with fallback logic applied.
 *
 * @example
 * // Standard image
 * <Image src="/logo.png" alt="Logo" />
 *
 * @example
 * // Image with fallback
 * <Image src="/broken.png" fallback="/fallback.png" alt="With fallback" />
 *
 * @example
 * // Image with fallback only on error
 * <Image src="/broken.png" fallback="/fallback.png" fallbackStrategy="onError" alt="With fallback on error" />
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, fallback, fallbackStrategy = "beforeLoadOrError", ...rest }, ref) => {
    const [loading, { off: offLoading }] = useBoolean(
      Boolean(fallback && fallbackStrategy === "beforeLoadOrError"),
    )
    const [error, { on: onError, off: offError }] = useBoolean(false)
    const ignoreFallback = !loading && !error
    const source = isString(src) ? src : (src as StaticImageData).src
    const status = useImage({ src: source, ignoreFallback })
    const isFallbackImage = shouldShowFallbackImage(status, fallbackStrategy)

    const handleError = useCallback(() => {
      offLoading()
      onError()
    }, [offLoading, onError])

    const handleLoad = useCallback(() => {
      offLoading()
      offError()
    }, [offLoading, offError])

    if (isFallbackImage && fallback) {
      return <CustomNextImage ref={ref} src={fallback} {...rest} />
    }

    return (
      <CustomNextImage onError={handleError} onLoad={handleLoad} ref={ref} src={src} {...rest} />
    )
  },
)

Image.displayName = "Image"
