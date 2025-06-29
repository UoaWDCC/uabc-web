import { Box, Text, VStack } from "@yamada-ui/react"
import type React from "react"
import {
  renderCodeNode,
  renderHeadingNode,
  renderHorizontalRuleNode,
  renderLineBreakNode,
  renderLinkNode,
  renderListItemNode,
  renderListNode,
  renderParagraphNode,
  renderQuoteNode,
  renderTextNode,
  renderUploadNode,
} from "./renderers"
import type { RichTextRendererOptions, SerializedEditorState, SerializedLexicalNode } from "./types"
import {
  hasChildren,
  isCodeNode,
  isHeadingNode,
  isHorizontalRuleNode,
  isLineBreakNode,
  isLinkNode,
  isListItemNode,
  isListNode,
  isParagraphNode,
  isQuoteNode,
  isTextNode,
  isUploadNode,
} from "./utils"

/**
 * Frontend Rich Text Renderer for Yamada UI
 *
 * Converts Payload CMS Lexical rich text content into Yamada UI components
 *
 * @example
 * ```tsx
 * const renderer = new RichTextRenderer()
 *
 * // Basic usage
 * const content = renderer.render(richTextData)
 *
 * // With custom props and media base URL for resolving relative image paths
 * const content = renderer.render(richTextData, {
 *   textProps: { color: "gray.600" },
 *   headingProps: { color: "gray.900" },
 *   mediaBaseUrl: process.env.NEXT_PUBLIC_API_URL
 * })
 *
 * // In a React component
 * function BlogPost({ content }) {
 *   return (
 *     <Box>
 *       {renderer.render(content, {
 *         mediaBaseUrl: "https://api.example.com"
 *       })}
 *     </Box>
 *   )
 * }
 * ```
 */
export class RichTextRenderer {
  /**
   * Render rich text content as Yamada UI components
   */
  render(data: SerializedEditorState, options: RichTextRendererOptions = {}): React.ReactNode {
    if (!data?.root?.children) {
      return null
    }

    return this.renderNodes(data.root.children, options)
  }

  /**
   * Render an array of nodes
   */
  private renderNodes(
    nodes: SerializedLexicalNode[],
    options: RichTextRendererOptions,
  ): React.ReactNode {
    if (!nodes || nodes.length === 0) {
      return null
    }

    return <VStack>{nodes.map((node) => this.renderNode(node, options))}</VStack>
  }

  /**
   * Render a single node
   */
  public renderNode(
    node: SerializedLexicalNode,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    if (options.customComponents?.[node.type]) {
      const CustomComponent = options.customComponents[node.type]
      return (
        <CustomComponent node={node}>
          {hasChildren(node) ? this.renderInlineNodes(node.children, options) : null}
        </CustomComponent>
      )
    }

    if (isLineBreakNode(node)) {
      return renderLineBreakNode()
    }

    if (isTextNode(node)) {
      return renderTextNode(node, options)
    }

    if (isHeadingNode(node)) {
      return renderHeadingNode(node, options, this.renderInlineNodes.bind(this))
    }

    if (isParagraphNode(node)) {
      return renderParagraphNode(node, options, this.renderInlineNodes.bind(this))
    }

    if (isLinkNode(node)) {
      return renderLinkNode(node, options, this.renderInlineNodes.bind(this))
    }

    if (isUploadNode(node)) {
      return renderUploadNode(node, options)
    }

    if (isQuoteNode(node)) {
      return renderQuoteNode(node, options, this.renderInlineNodes.bind(this))
    }

    if (isListNode(node)) {
      return renderListNode(node, options, this.renderNode.bind(this))
    }

    if (isListItemNode(node)) {
      return renderListItemNode(node, options, this.renderInlineNodes.bind(this))
    }

    if (isHorizontalRuleNode(node)) {
      return renderHorizontalRuleNode()
    }

    if (isCodeNode(node)) {
      return renderCodeNode(node, options)
    }

    if (hasChildren(node)) {
      return <Box>{this.renderInlineNodes(node.children, options)}</Box>
    }

    return null
  }

  /**
   * Render inline nodes (for use within other components)
   */
  public renderInlineNodes(
    nodes: SerializedLexicalNode[],
    options: RichTextRendererOptions,
  ): React.ReactNode {
    if (!nodes || nodes.length === 0) {
      return null
    }

    return nodes.map((node) => {
      if (isTextNode(node)) {
        return renderTextNode(node, options)
      }

      if (isLinkNode(node)) {
        return renderLinkNode(node, options, this.renderInlineNodes.bind(this))
      }

      if (isLineBreakNode(node)) {
        return renderLineBreakNode()
      }

      if (hasChildren(node)) {
        return <Text as="span">{this.renderInlineNodes(node.children, options)}</Text>
      }

      return null
    })
  }
}

/**
 * Singleton instance for convenience
 */
export const richTextRenderer = new RichTextRenderer()
