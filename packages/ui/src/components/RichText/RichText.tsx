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
      return richTextRenderer.render(data, options)
    }, [data, options])

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
