import React from "react"
import { richTextRenderer } from "./lib/RichTextRenderer"
import type { RichTextProps, RichTextRendererOptions } from "./lib/types"

/**
 * React component for rendering rich text content from Payload CMS
 *
 * This component takes Lexical editor state data from Payload CMS and renders it
 * as styled React components using Yamada UI. It supports text formatting, headings,
 * paragraphs, links, images, lists, quotes, code blocks, and more.
 *
 * @param data - The rich text data from Payload CMS (Lexical editor state)
 * @param fallback - Content to display when data is null/undefined or empty (default: null)
 * @param textProps - Props to pass to Text components for styling paragraphs and text
 * @param headingProps - Props to pass to Heading components for styling headings
 * @param linkProps - Props to pass to Link components for styling links
 * @param imageProps - Props to pass to Image components for styling images
 * @param codeProps - Props to pass to Code components for styling inline code and code blocks
 * @param mediaBaseUrl - Base URL for resolving relative media URLs (e.g., "https://api.example.com")
 * @param customComponents - Custom React components to override default renderers for specific node types
 *
 * @returns The rendered rich text content as React elements, or fallback if no content
 *
 * @example
 * ```tsx
 * // Basic usage
 * <RichText data={richTextData} />
 *
 * // With custom styling
 * <RichText
 *   data={richTextData}
 *   textProps={{ color: "gray.600", lineHeight: "relaxed" }}
 *   headingProps={{ color: "gray.900" }}
 *   linkProps={{ color: "blue.500" }}
 * />
 *
 * // With media base URL for resolving images
 * <RichText
 *   data={richTextData}
 *   mediaBaseUrl={process.env.NEXT_PUBLIC_API_URL}
 * />
 *
 * // With fallback content
 * <RichText
 *   data={richTextData}
 *   fallback={<Text>No content available</Text>}
 * />
 *
 * // With custom components
 * <RichText
 *   data={richTextData}
 *   customComponents={{
 *     paragraph: CustomParagraph,
 *     heading: CustomHeading
 *   }}
 * />
 * ```
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

    if (!data || !content) {
      return fallback
    }

    return content
  },
)

RichText.displayName = "RichText"

export default RichText
