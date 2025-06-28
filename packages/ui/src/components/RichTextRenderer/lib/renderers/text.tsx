import { Code, Em, Text } from "@yamada-ui/react"
import type React from "react"
import { TextFormat } from "../constants"
import type { RichTextRendererOptions, SerializedTextNode } from "../types"

/**
 * Text node renderer that handles all text formatting
 */
export const renderTextNode = (
  node: SerializedTextNode,
  key: string,
  options: RichTextRendererOptions,
): React.ReactNode => {
  const { text, format = 0 } = node

  if (format & TextFormat.CODE) {
    return (
      <Code key={key} {...options.codeProps}>
        {text}
      </Code>
    )
  }

  const textProps = {
    ...(format & TextFormat.UNDERLINE && { textDecoration: "underline" }),
    ...options.textProps,
  }

  const isBold = !!(format & TextFormat.BOLD)
  const isItalic = !!(format & TextFormat.ITALIC)
  const isStrikethrough = !!(format & TextFormat.STRIKETHROUGH)

  if (isBold && isItalic && isStrikethrough) {
    return (
      <Text as="s" key={key} {...textProps}>
        <Text as="strong">
          <Em>{text}</Em>
        </Text>
      </Text>
    )
  }

  if (isBold && isItalic) {
    return (
      <Text as="strong" key={key} {...textProps}>
        <Em>{text}</Em>
      </Text>
    )
  }

  if (isBold && isStrikethrough) {
    return (
      <Text as="s" key={key} {...textProps}>
        <Text as="strong">{text}</Text>
      </Text>
    )
  }

  if (isItalic && isStrikethrough) {
    return (
      <Text as="s" key={key} {...textProps}>
        <Em>{text}</Em>
      </Text>
    )
  }

  if (isBold) {
    return (
      <Text as="strong" key={key} {...textProps}>
        {text}
      </Text>
    )
  }

  if (isItalic) {
    return (
      <Em key={key} {...textProps}>
        {text}
      </Em>
    )
  }

  if (isStrikethrough) {
    return (
      <Text as="s" key={key} {...textProps}>
        {text}
      </Text>
    )
  }

  return (
    <Text as="span" key={key} {...textProps}>
      {text}
    </Text>
  )
}
