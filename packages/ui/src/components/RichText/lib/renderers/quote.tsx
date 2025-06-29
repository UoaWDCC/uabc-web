import { Blockquote } from "@yamada-ui/react"
import type React from "react"
import type { RichTextRendererOptions, SerializedLexicalNode, SerializedQuoteNode } from "../types"

type RenderInlineNodes = (
  nodes: SerializedLexicalNode[],
  options: RichTextRendererOptions,
) => React.ReactNode

export const renderQuoteNode = (
  node: SerializedQuoteNode,
  options: RichTextRendererOptions,
  renderInlineNodes: RenderInlineNodes,
): React.ReactNode => {
  const { children } = node

  if (!children || children.length === 0) {
    return null
  }

  return <Blockquote>{renderInlineNodes(children, options)}</Blockquote>
}
