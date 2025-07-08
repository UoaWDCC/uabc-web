import type { SerializedLexicalNode, SerializedListItemNode } from "@repo/shared"
import { ListItem } from "@yamada-ui/react"
import type React from "react"
import type { RichTextRendererOptions } from "../types"

type RenderInlineNodes = (
  nodes: SerializedLexicalNode[],
  options: RichTextRendererOptions,
) => React.ReactNode

/**
 * Renders a list item node as a ListItem component
 *
 * This function creates individual list items using Yamada UI's ListItem
 * component. It renders the list item's child content using the provided
 * renderInlineNodes function to handle text, links, and other inline elements.
 * Used within list structures to create proper semantic markup.
 *
 * @param node - The list item node containing children content
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options for styling customization
 * @param renderInlineNodes - Function to render the list item's child nodes
 * @returns ListItem component containing the item content, or empty item if no children
 *
 * @example
 * ```tsx
 * const listItemNode = {
 *   type: 'listitem',
 *   children: [
 *     { type: 'text', text: 'This is a list item with ' },
 *     { type: 'text', text: 'bold text', format: TextFormat.BOLD }
 *   ]
 * }
 *
 * const element = renderListItemNode(
 *   listItemNode,
 *   'listitem-1',
 *   {},
 *   renderInlineNodes
 * )
 * ```
 */
export const renderListItemNode = (
  node: SerializedListItemNode,
  key: string,
  options: RichTextRendererOptions,
  renderInlineNodes: RenderInlineNodes,
): React.ReactNode => {
  const { children } = node

  return <ListItem key={key}>{children ? renderInlineNodes(children, options) : null}</ListItem>
}
