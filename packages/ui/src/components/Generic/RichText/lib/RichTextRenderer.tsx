import type { SerializedEditorState, SerializedLexicalNode } from "@repo/shared"
import { Box, For, Text } from "@yamada-ui/react"
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
import type { RichTextRendererOptions } from "./types"
import {
  createNodeKey,
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
 * Main renderer class for converting Lexical editor state to React components
 *
 * This class handles the conversion of rich text data from Payload CMS (Lexical format)
 * into Yamada UI React components. It provides methods for rendering complete editor
 * states, individual nodes, and inline content with support for custom components.
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
   * Renders a complete editor state into Yamada UI components
   *
   * Takes the root editor state object from Payload CMS and converts all child nodes
   * into appropriate Yamada UI components. Returns null for empty or invalid data.
   *
   * @param data - The complete editor state from Payload CMS Lexical editor
   * @param options - Configuration options for rendering behavior and styling
   * @returns React elements representing the rich text content, or null if empty
   *
   * @example
   * ```tsx
   * const renderer = new RichTextRenderer()
   * const content = renderer.render(editorState, {
   *   textProps: { color: "gray.600" },
   *   headingProps: { color: "gray.900" }
   * })
   * ```
   */
  render(data: SerializedEditorState, options: RichTextRendererOptions = {}): React.ReactNode {
    if (!data?.root?.children) {
      return null
    }

    return this.renderNodes(data.root.children, options)
  }

  /**
   * Renders an array of nodes as a vertical stack of components
   *
   * This method takes an array of nodes and renders each one using renderNode,
   * then wraps them in a VStack component for proper vertical spacing.
   *
   * @param nodes - Array of Lexical nodes to render
   * @param options - Configuration options for rendering behavior and styling
   * @returns VStack containing all rendered nodes, or null if no nodes
   *
   * @private
   */
  private renderNodes(
    nodes: SerializedLexicalNode[],
    options: RichTextRendererOptions,
  ): React.ReactNode {
    if (!nodes || nodes.length === 0) {
      return null
    }

    return <For each={nodes}>{(node) => this.renderNode(node, options)}</For>
  }

  /**
   * Renders a single node into its corresponding React component
   *
   * This method determines the node type and delegates to the appropriate
   * renderer function. It handles custom components, all known node types
   * (text, heading, paragraph, link, etc.), and provides fallback rendering
   * for unknown node types.
   *
   * @param node - The individual Lexical node to render
   * @param options - Configuration options for rendering behavior and styling
   * @returns React element for the node, or null if the node cannot be rendered
   *
   * @example
   * ```tsx
   * const renderer = new RichTextRenderer()
   * const element = renderer.renderNode(textNode, { textProps: { color: "blue" } })
   * ```
   */
  public renderNode(
    node: SerializedLexicalNode,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    const key = createNodeKey()

    if (options.customComponents?.[node.type]) {
      const CustomComponent = options.customComponents[node.type]
      return (
        <CustomComponent key={key} node={node}>
          {hasChildren(node) ? this.renderInlineNodes(node.children, options) : null}
        </CustomComponent>
      )
    }

    if (isLineBreakNode(node)) {
      return renderLineBreakNode(key)
    }

    if (isTextNode(node)) {
      return renderTextNode(node, key, options)
    }

    if (isHeadingNode(node)) {
      return renderHeadingNode(node, key, options, this.renderInlineNodes.bind(this))
    }

    if (isParagraphNode(node)) {
      return renderParagraphNode(node, key, options, this.renderInlineNodes.bind(this))
    }

    if (isLinkNode(node)) {
      return renderLinkNode(node, key, options, this.renderInlineNodes.bind(this))
    }

    if (isUploadNode(node)) {
      return renderUploadNode(node, key, options)
    }

    if (isQuoteNode(node)) {
      return renderQuoteNode(node, key, options, this.renderInlineNodes.bind(this))
    }

    if (isListNode(node)) {
      return renderListNode(node, key, options, this.renderNode.bind(this))
    }

    if (isListItemNode(node)) {
      return renderListItemNode(node, key, options, this.renderInlineNodes.bind(this))
    }

    if (isHorizontalRuleNode(node)) {
      return renderHorizontalRuleNode(key)
    }

    if (isCodeNode(node)) {
      return renderCodeNode(node, key, options)
    }

    if (hasChildren(node)) {
      return <Box key={key}>{this.renderInlineNodes(node.children, options)}</Box>
    }

    return null
  }

  /**
   * Renders an array of inline nodes (typically text content within blocks)
   *
   * This method processes arrays of nodes that appear inline within other
   * elements, such as text nodes, links, and formatting within paragraphs.
   * It's used by block-level renderers to handle their content and supports
   * nested inline elements.
   *
   * @param nodes - Array of nodes to render inline
   * @param options - Configuration options for rendering behavior and styling
   * @returns Array of React elements for the inline content, or null if empty
   *
   * @example
   * ```tsx
   * const renderer = new RichTextRenderer()
   * const inlineContent = renderer.renderInlineNodes([textNode, linkNode], options)
   * ```
   */
  public renderInlineNodes(
    nodes: SerializedLexicalNode[],
    options: RichTextRendererOptions,
  ): React.ReactNode {
    if (!nodes?.length) {
      return null
    }

    return nodes.map((node) => {
      const key = createNodeKey()

      if (isTextNode(node)) {
        return renderTextNode(node, key, options)
      }
      if (isLinkNode(node)) {
        return renderLinkNode(node, key, options, this.renderInlineNodes.bind(this))
      }
      if (isLineBreakNode(node)) {
        return renderLineBreakNode(key)
      }

      if (hasChildren(node)) {
        return (
          <Text as="span" key={key}>
            {this.renderInlineNodes(node.children, options)}
          </Text>
        )
      }

      return null
    })
  }
}

/**
 * Singleton instance of RichTextRenderer for consistent usage across the application
 *
 * This exported instance ensures that all parts of the application use the same
 * renderer instance, which can be beneficial for performance and consistency.
 * Use this instead of creating new instances unless you need specific customization.
 *
 * @example
 * ```tsx
 * import { richTextRenderer } from './RichTextRenderer'
 *
 * const content = richTextRenderer.render(editorState, options)
 * ```
 */
export const richTextRenderer = new RichTextRenderer()
