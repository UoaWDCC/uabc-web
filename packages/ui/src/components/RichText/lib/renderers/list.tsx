import { DecimalList, DiscList, For } from "@yamada-ui/react"
import type React from "react"
import { ListType } from "../constants"
import type { RichTextRendererOptions, SerializedLexicalNode, SerializedListNode } from "../types"

type RenderNode = (node: SerializedLexicalNode, options: RichTextRendererOptions) => React.ReactNode

export const renderListNode = (
  node: SerializedListNode,
  options: RichTextRendererOptions,
  renderNode: RenderNode,
): React.ReactNode => {
  const { tag, children } = node

  if (!children || children.length === 0) {
    return null
  }

  if (tag === ListType.UNORDERED) {
    return (
      <DiscList>
        <For each={children}>{(child) => renderNode(child, options)}</For>
      </DiscList>
    )
  }

  return (
    <DecimalList>
      <For each={children}>{(child) => renderNode(child, options)}</For>
    </DecimalList>
  )
}
