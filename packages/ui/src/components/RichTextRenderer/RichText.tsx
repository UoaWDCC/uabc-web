import React from "react"
import { richTextRenderer } from "./lib/RichTextRenderer"
import type { RichTextProps, RichTextRendererOptions } from "./lib/types"

/**
 * React component wrapper for rich text content
 */
export const RichText: React.FC<RichTextProps> = React.memo(
  ({
    data,
    fallback = null,
    textProps,
    headingProps,
    linkProps,
    imageProps,
    codeProps,
    mediaBaseUrl,
    customComponents,
  }) => {
    // Use singleton renderer directly for better performance
    const renderer = richTextRenderer

    // Memoize the options object to prevent unnecessary re-renders
    const options = React.useMemo(
      (): RichTextRendererOptions => ({
        textProps,
        headingProps,
        linkProps,
        imageProps,
        codeProps,
        mediaBaseUrl,
        customComponents,
      }),
      [textProps, headingProps, linkProps, imageProps, codeProps, mediaBaseUrl, customComponents],
    )

    const content = React.useMemo(() => {
      if (!data) {
        return null
      }
      return renderer.render(data, options)
    }, [data, options, renderer.render])

    if (!data) {
      return <>{fallback}</>
    }

    if (!content) {
      return <>{fallback}</>
    }

    return <>{content}</>
  },
)

RichText.displayName = "RichText"

export default RichText
