import { Code, Em, Text, type TextProps } from "@yamada-ui/react"
import React from "react"
import { TextFormat } from "../constants"
import type { RichTextRendererOptions, SerializedTextNode } from "../types"

/**
 * Text node renderer that handles all text formatting
 */
export const renderTextNode = (
  node: SerializedTextNode,
  options: RichTextRendererOptions,
): React.ReactNode => {
  const { text, format = 0 } = node

  if (format & TextFormat.CODE) {
    return <Code {...options.codeProps}>{text}</Code>
  }

  const textProps: Partial<TextProps> = { ...options.textProps }
  let content: React.ReactNode = text

  if (format & TextFormat.ITALIC) {
    content = <Em>{content}</Em>
  }
  if (format & TextFormat.BOLD) {
    content = <Text as="strong">{content}</Text>
  }
  if (format & TextFormat.STRIKETHROUGH) {
    content = <Text as="s">{content}</Text>
  }
  if (format & TextFormat.UNDERLINE) {
    content = (
      <Text as="span" textDecoration="underline">
        {content}
      </Text>
    )
  }

  if (typeof content === "string") {
    return (
      <Text as="span" {...textProps}>
        {content}
      </Text>
    )
  }

  if (React.isValidElement(content)) {
    return React.cloneElement(content as React.ReactElement, { ...textProps })
  }

  return content
}
