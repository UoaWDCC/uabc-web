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

export const renderParagraphNode = (
  node: SerializedParagraphNode,
  options: RichTextRendererOptions,
  renderInlineNodes: RenderInlineNodes,
): React.ReactNode => {
  const { children } = node

  if (!children || children.length === 0) {
    return null
  }

  return <Text {...options.textProps}>{renderInlineNodes(children, options)}</Text>
}
