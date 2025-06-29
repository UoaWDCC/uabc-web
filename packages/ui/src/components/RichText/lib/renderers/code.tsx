import { Code } from "@yamada-ui/react"
import type React from "react"
import type { RichTextRendererOptions, SerializedCodeNode } from "../types"
import { extractTextFromNodes } from "../utils"

/**
 * Renders a code block node as a styled Code component
 *
 * This function extracts text content from the code node's children and renders
 * it using Yamada UI's Code component. It preserves formatting with monospace
 * font and handles optional language specification for syntax highlighting.
 *
 * @param node - The code node containing the code content and optional language
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options including codeProps for styling customization
 * @returns Code component with the extracted text content
 *
 * @example
 * ```tsx
 * const codeNode = {
 *   type: 'code',
 *   language: 'javascript',
 *   children: [{ type: 'text', text: 'console.log("Hello")' }]
 * }
 *
 * const element = renderCodeNode(codeNode, 'code-1', {
 *   codeProps: { bg: 'gray.100', p: 'md' }
 * })
 * ```
 */
export const renderCodeNode = (
  node: SerializedCodeNode,
  key: string,
  options: RichTextRendererOptions,
): React.ReactNode => {
  const { children, language } = node

  const codeContent = children ? extractTextFromNodes(children) : ""

  return (
    <Code data-language={language} key={key} {...options.codeProps}>
      {codeContent}
    </Code>
  )
}
