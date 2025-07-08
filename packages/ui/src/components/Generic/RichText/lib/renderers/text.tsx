import type { SerializedTextNode } from "@repo/shared"
import { Code, Em, Text, type TextProps } from "@yamada-ui/react"
import React from "react"
import { TextFormat } from "../constants"
import type { RichTextRendererOptions } from "../types"

/**
 * Renders a text node with appropriate formatting based on format flags
 *
 * This function handles all text formatting options including bold, italic,
 * strikethrough, underline, and code. It uses bitwise operations to check
 * format flags and applies the appropriate Yamada UI components. Code format
 * takes precedence and uses the Code component, while other formats are
 * combined using nested Text components.
 *
 * @param node - The text node containing text content and format flags
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options including textProps and codeProps for styling
 * @returns Text or Code component with appropriate formatting, or null for null text
 *
 * @example
 * ```tsx
 * // Bold and italic text
 * const textNode = {
 *   type: 'text',
 *   text: 'Important text',
 *   format: TextFormat.BOLD | TextFormat.ITALIC
 * }
 *
 * // Code text
 * const codeTextNode = {
 *   type: 'text',
 *   text: 'console.log()',
 *   format: TextFormat.CODE
 * }
 *
 * const element = renderTextNode(textNode, 'text-1', {
 *   textProps: { color: 'gray.700' }
 * })
 * ```
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
      <Text as="span" key={key} {...textProps}>
        {content}
      </Text>
    )
  }

  if (React.isValidElement(content)) {
    return React.cloneElement(content as React.ReactElement, { key, ...textProps })
  }

  return content
}
