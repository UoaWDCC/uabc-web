import { ListItem } from "@yamada-ui/react"
import type React from "react"
import type {
  RichTextRendererOptions,
  SerializedLexicalNode,
  SerializedListItemNode,
} from "../types"

type RenderInlineNodes = (
  nodes: SerializedLexicalNode[],
  options: RichTextRendererOptions,
) => React.ReactNode

export const renderListItemNode = (
  node: SerializedListItemNode,
  options: RichTextRendererOptions,
  renderInlineNodes: RenderInlineNodes,
): React.ReactNode => {
  const { children } = node

  return <ListItem>{children ? renderInlineNodes(children, options) : null}</ListItem>
}
