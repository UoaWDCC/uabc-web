import { Heading } from "@repo/ui/components/Heading"
import type React from "react"
import type { RichTextRendererOptions, SerializedHeadingNode } from "../types"

export const renderHeadingNode = (
  node: SerializedHeadingNode,
  options: RichTextRendererOptions,
  // biome-ignore lint/suspicious/noExplicitAny: The type of nodes is determined dynamically at runtime and can include various node shapes, so 'any[]' is used here for flexibility in rendering different inline node types.
  renderInlineNodes: (nodes: any[], options: RichTextRendererOptions) => React.ReactNode,
): React.ReactNode => {
  const { tag, children } = node

  return (
    <Heading as={tag} {...options.headingProps}>
      {renderInlineNodes(children, options)}
    </Heading>
  )
}
