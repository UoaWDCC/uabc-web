"use client"

import { isString, useBoolean, useImage } from "@yamada-ui/react"
import type { StaticImageData } from "next/image"
import { forwardRef, useCallback } from "react"
import type { ImageProps } from "./Image.types"
import { shouldShowFallbackImage } from "./Image.utils"
import { CustomNextImage } from "./ImageBase"

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
