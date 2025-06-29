import { DecimalList, DiscList, For } from "@yamada-ui/react"
import type React from "react"
import type { RichTextRendererOptions, SerializedLexicalNode, SerializedListNode } from "../types"

type RenderNode = (node: SerializedLexicalNode, options: RichTextRendererOptions) => React.ReactNode

export const renderListNode = (
  node: SerializedListNode,
  key: string,
  options: RichTextRendererOptions,
  renderNode: RenderNode,
): React.ReactNode => {
  const { tag, children } = node

  if (!children || children.length === 0) {
    return null
  }

  if (tag === "ul") {
    return (
      <DiscList key={key}>
        <For each={children}>{(child) => renderNode(child, options)}</For>
      </DiscList>
    )
  }

  return (
    <DecimalList key={key}>
      <For each={children}>{(child) => renderNode(child, options)}</For>
    </DecimalList>
  )
}
