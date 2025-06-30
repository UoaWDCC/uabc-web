import { Heading } from "@repo/ui/components/Heading"
import type React from "react"
import type { RichTextRendererOptions, SerializedHeadingNode } from "../types"

/**
 * Renders a heading node as a styled Heading component
 *
 * This function creates semantic heading elements (h1-h6) based on the tag
 * specified in the heading node. It renders the heading content using the
 * provided renderInlineNodes function to handle any nested formatting.
 *
 * @param node - The heading node containing the tag and children content
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options including headingProps for styling customization
 * @param renderInlineNodes - Function to render the heading's child nodes (text, links, etc.)
 * @returns Heading component with the specified semantic level and content
 *
 * @example
 * ```tsx
 * const headingNode = {
 *   type: 'heading',
 *   tag: 'h1',
 *   children: [{ type: 'text', text: 'Main Title' }]
 * }
 *
 * const element = renderHeadingNode(
 *   headingNode,
 *   'heading-1',
 *   { headingProps: { color: 'blue.600' } },
 *   renderInlineNodes
 * )
 * ```
 */
export const renderHeadingNode = (
  node: SerializedHeadingNode,
  key: string,
  options: RichTextRendererOptions,
  // biome-ignore lint/suspicious/noExplicitAny: The type of nodes is determined dynamically at runtime and can include various node shapes, so 'any[]' is used here for flexibility in rendering different inline node types.
  renderInlineNodes: (nodes: any[], options: RichTextRendererOptions) => React.ReactNode,
): React.ReactNode => {
  const { tag, children } = node

  return (
    <Heading as={tag} key={key} {...options.headingProps}>
      {renderInlineNodes(children, options)}
    </Heading>
  )
}
