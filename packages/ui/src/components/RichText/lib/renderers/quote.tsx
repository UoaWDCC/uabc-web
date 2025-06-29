import { Blockquote } from "@yamada-ui/react"
import type React from "react"
import type { RichTextRendererOptions, SerializedLexicalNode, SerializedQuoteNode } from "../types"

type RenderInlineNodes = (
  nodes: SerializedLexicalNode[],
  options: RichTextRendererOptions,
) => React.ReactNode

/**
 * Renders a quote node as a Blockquote component
 *
 * This function creates a blockquote element using Yamada UI's Blockquote
 * component for quoted content. It renders the quote's child content using
 * the provided renderInlineNodes function to handle text and formatting.
 * Returns null for empty quotes to avoid rendering unnecessary elements.
 *
 * @param node - The quote node containing children content
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options for styling customization
 * @param renderInlineNodes - Function to render the quote's child nodes
 * @returns Blockquote component containing the quote content, or null if empty
 *
 * @example
 * ```tsx
 * const quoteNode = {
 *   type: 'quote',
 *   children: [
 *     { type: 'text', text: 'The only way to do great work is to love what you do.' }
 *   ]
 * }
 *
 * const element = renderQuoteNode(
 *   quoteNode,
 *   'quote-1',
 *   {},
 *   renderInlineNodes
 * )
 * ```
 */
export const renderQuoteNode = (
  node: SerializedQuoteNode,
  key: string,
  options: RichTextRendererOptions,
  renderInlineNodes: RenderInlineNodes,
): React.ReactNode => {
  const { children } = node

  if (!children || children.length === 0) {
    return null
  }

  return <Blockquote key={key}>{renderInlineNodes(children, options)}</Blockquote>
}
