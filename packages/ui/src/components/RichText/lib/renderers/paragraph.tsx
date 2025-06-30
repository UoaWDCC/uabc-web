import { Text } from "@yamada-ui/react"
import type React from "react"
import type {
  RichTextRendererOptions,
  SerializedLexicalNode,
  SerializedParagraphNode,
} from "../types"

type RenderInlineNodes = (
  nodes: SerializedLexicalNode[],
  options: RichTextRendererOptions,
) => React.ReactNode

/**
 * Renders a paragraph node as a Text component
 *
 * This function creates a paragraph element using Yamada UI's Text component.
 * It renders the paragraph's child content using the provided renderInlineNodes
 * function to handle text, links, and other inline elements. Returns null for
 * empty paragraphs to avoid rendering unnecessary elements.
 *
 * @param node - The paragraph node containing children content
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options including textProps for styling customization
 * @param renderInlineNodes - Function to render the paragraph's child nodes
 * @returns Text component containing the paragraph content, or null if empty
 *
 * @example
 * ```tsx
 * const paragraphNode = {
 *   type: 'paragraph',
 *   children: [
 *     { type: 'text', text: 'This is a ' },
 *     { type: 'text', text: 'paragraph', format: TextFormat.BOLD },
 *     { type: 'text', text: ' with formatting.' }
 *   ]
 * }
 *
 * const element = renderParagraphNode(
 *   paragraphNode,
 *   'paragraph-1',
 *   { textProps: { lineHeight: 'relaxed' } },
 *   renderInlineNodes
 * )
 * ```
 */
export const renderParagraphNode = (
  node: SerializedParagraphNode,
  key: string,
  options: RichTextRendererOptions,
  renderInlineNodes: RenderInlineNodes,
): React.ReactNode => {
  const { children } = node

  if (!children?.length) {
    return null
  }

  return (
    <Text key={key} {...options.textProps}>
      {renderInlineNodes(children, options)}
    </Text>
  )
}
