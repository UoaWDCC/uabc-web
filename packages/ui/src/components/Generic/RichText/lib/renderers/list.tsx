import type { SerializedLexicalNode, SerializedListNode } from "@repo/shared"
import { DecimalList, DiscList, For } from "@yamada-ui/react"
import type React from "react"
import { ListType } from "../constants"
import type { RichTextRendererOptions } from "../types"

type RenderNode = (node: SerializedLexicalNode, options: RichTextRendererOptions) => React.ReactNode

/**
 * Renders a list node as either an ordered or unordered list
 *
 * This function creates list elements using Yamada UI's DecimalList (for ordered
 * lists) or DiscList (for unordered lists) based on the list tag. It renders
 * each child list item using the provided renderNode function. Returns null
 * for empty lists to avoid rendering unnecessary elements.
 *
 * @param node - The list node containing tag (ol/ul) and children (list items)
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options for styling customization
 * @param renderNode - Function to render individual list item nodes
 * @returns DecimalList/DiscList component containing list items, or null if empty
 *
 * @example
 * ```tsx
 * // Unordered list
 * const unorderedListNode = {
 *   type: 'list',
 *   tag: 'ul',
 *   children: [
 *     { type: 'listitem', children: [{ type: 'text', text: 'First item' }] },
 *     { type: 'listitem', children: [{ type: 'text', text: 'Second item' }] }
 *   ]
 * }
 *
 * // Ordered list
 * const orderedListNode = {
 *   type: 'list',
 *   tag: 'ol',
 *   children: [...]
 * }
 *
 * const element = renderListNode(
 *   unorderedListNode,
 *   'list-1',
 *   {},
 *   renderNode
 * )
 * ```
 */
export const renderListNode = (
  node: SerializedListNode,
  key: string,
  options: RichTextRendererOptions,
  renderNode: RenderNode,
): React.ReactNode => {
  const { tag, children } = node

  if (!children?.length) {
    return null
  }

  if (tag === ListType.UNORDERED) {
    return (
      <DiscList key={key} {...options.listProps}>
        <For each={children}>{(child) => renderNode(child, options)}</For>
      </DiscList>
    )
  }

  return (
    <DecimalList key={key} {...options.listProps}>
      <For each={children}>{(child) => renderNode(child, options)}</For>
    </DecimalList>
  )
}
