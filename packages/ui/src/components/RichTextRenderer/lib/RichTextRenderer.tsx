import { Image } from "@repo/ui/components/Image"
import {
  Blockquote,
  Box,
  Code,
  DecimalList,
  DiscList,
  For,
  Link,
  ListItem,
  Separator,
  Text,
  VStack,
} from "@yamada-ui/react"
import NextLink from "next/link"
import type React from "react"
import { renderHeadingNode, renderTextNode } from "./renderers"
import type {
  RichTextRendererOptions,
  SerializedCodeNode,
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedUploadNode,
} from "./types"
import {
  createNodeKey,
  extractTextFromNodes,
  hasChildren,
  isCodeNode,
  isDocumentWithSlug,
  isHeadingNode,
  isHorizontalRuleNode,
  isLineBreakNode,
  isLinkNode,
  isListItemNode,
  isListNode,
  isMediaDocument,
  isParagraphNode,
  isQuoteNode,
  isTextNode,
  isUploadNode,
  isValidLinkFields,
} from "./utils"

/**
 * Utility function to resolve relative URLs with a base URL
 */
const resolveUrl = (url: string, baseUrl?: string): string => {
  // If no base URL provided or URL is already absolute, return as is
  if (!baseUrl || url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
    return url
  }

  // Remove trailing slash from base URL and leading slash from path if present
  const cleanBaseUrl = baseUrl.replace(/\/$/, "")
  const cleanPath = url.startsWith("/") ? url : `/${url}`

  return `${cleanBaseUrl}${cleanPath}`
}

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
    if (!data || !data.root || !data.root.children) {
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

    return (
      <VStack align="stretch" gap="md">
        {nodes.map((node) => this.renderNode(node, options))}
      </VStack>
    )
  }

  /**
   * Render a single node
   */
  private renderNode(
    node: SerializedLexicalNode,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    const key = createNodeKey()

    // Check for custom components first
    if (options.customComponents?.[node.type]) {
      const CustomComponent = options.customComponents[node.type]
      return (
        <CustomComponent key={key} node={node}>
          {hasChildren(node) ? this.renderInlineNodes(node.children, options) : null}
        </CustomComponent>
      )
    }

    // Text nodes
    if (isTextNode(node)) {
      return renderTextNode(node, key, options)
    }

    // Heading nodes
    if (isHeadingNode(node)) {
      return renderHeadingNode(node, key, options, this.renderInlineNodes.bind(this))
    }

    // Paragraph nodes
    if (isParagraphNode(node)) {
      return this.renderParagraphNode(node, key, options)
    }

    // Link nodes
    if (isLinkNode(node)) {
      return this.renderLinkNode(node, key, options)
    }

    // Upload/Image nodes
    if (isUploadNode(node)) {
      return this.renderUploadNode(node, key, options)
    }

    // Quote nodes
    if (isQuoteNode(node)) {
      return this.renderQuoteNode(node, key, options)
    }

    // List nodes
    if (isListNode(node)) {
      return this.renderListNode(node, key, options)
    }

    // List item nodes
    if (isListItemNode(node)) {
      return this.renderListItemNode(node, key, options)
    }

    // Line break nodes
    if (isLineBreakNode(node)) {
      return <br key={key} />
    }

    // Horizontal rule nodes
    if (isHorizontalRuleNode(node)) {
      return <Separator key={key} />
    }

    // Code nodes
    if (isCodeNode(node)) {
      return this.renderCodeNode(node, key, options)
    }

    // Generic fallback for unknown nodes with children
    if (hasChildren(node)) {
      return <Box key={key}>{this.renderInlineNodes(node.children, options)}</Box>
    }

    // Unknown node without children
    return null
  }

  /**
   * Render inline nodes (for use within other components)
   */
  private renderInlineNodes(
    nodes: SerializedLexicalNode[],
    options: RichTextRendererOptions,
  ): React.ReactNode {
    if (!nodes || nodes.length === 0) {
      return null
    }

    return nodes.map((node) => {
      const key = createNodeKey()

      if (isTextNode(node)) {
        return renderTextNode(node, key, options)
      }

      if (isLinkNode(node)) {
        return this.renderLinkNode(node, key, options)
      }

      if (isLineBreakNode(node)) {
        return <br key={key} />
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

  /**
   * Render paragraph node
   */
  private renderParagraphNode(
    node: SerializedParagraphNode,
    key: string,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    const { children } = node

    if (!children || children.length === 0) {
      return null
    }

    return (
      <Text key={key} {...options.textProps}>
        {this.renderInlineNodes(children, options)}
      </Text>
    )
  }

  /**
   * Render link node
   */
  private renderLinkNode(
    node: SerializedLinkNode,
    key: string,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    const { fields, children } = node

    if (!isValidLinkFields(fields)) {
      return (
        <Text as="span" key={key}>
          {this.renderInlineNodes(children, options)}
        </Text>
      )
    }

    let href: string | undefined
    let external = false

    if (fields.linkType === "custom" && fields.url) {
      href = fields.url
      external = fields.newTab || false
    } else if (fields.linkType === "internal" && fields.doc) {
      const doc = fields.doc
      if (isDocumentWithSlug(doc)) {
        href = `/${doc.slug}`
        external = fields.newTab || false
      }
    }

    if (!href) {
      return (
        <Text as="span" key={key}>
          {this.renderInlineNodes(children, options)}
        </Text>
      )
    }

    return (
      <Link as={NextLink} external={external} href={href} key={key} {...options.linkProps}>
        {this.renderInlineNodes(children, options)}
      </Link>
    )
  }

  /**
   * Render upload/image node
   */
  private renderUploadNode(
    node: SerializedUploadNode,
    key: string,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    if (node.relationTo !== "media") {
      return null
    }

    const uploadDoc = node.value

    if (!isMediaDocument(uploadDoc)) {
      return null
    }

    const { alt, url, width, height } = uploadDoc

    if (!url) {
      return null
    }

    // Resolve relative URLs with the media base URL
    const resolvedUrl = resolveUrl(url, options.mediaBaseUrl)

    return (
      <Image
        alt={alt || ""}
        height={height || 200}
        key={key}
        maxW="100%"
        src={resolvedUrl}
        width={width || 300}
        {...options.imageProps}
      />
    )
  }

  /**
   * Render quote node
   */
  private renderQuoteNode(
    node: SerializedQuoteNode,
    key: string,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    const { children } = node

    if (!children || children.length === 0) {
      return null
    }

    return <Blockquote key={key}>{this.renderInlineNodes(children, options)}</Blockquote>
  }

  /**
   * Render list node
   */
  private renderListNode(
    node: SerializedListNode,
    key: string,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    const { tag, children } = node

    if (!children || children.length === 0) {
      return null
    }

    if (tag === "ul") {
      return (
        <DiscList key={key}>
          <For each={children}>{(child) => this.renderNode(child, options)}</For>
        </DiscList>
      )
    }

    return (
      <DecimalList key={key}>
        <For each={children}>{(child) => this.renderNode(child, options)}</For>
      </DecimalList>
    )
  }

  /**
   * Render list item node
   */
  private renderListItemNode(
    node: SerializedListItemNode,
    key: string,
    options: RichTextRendererOptions,
  ): React.ReactNode {
    const { children } = node

    return (
      <ListItem key={key}>{children ? this.renderInlineNodes(children, options) : null}</ListItem>
    )
  }

  /**
   * Render code node
   */
  private renderCodeNode(
    node: SerializedCodeNode,
    key: string,
    _options: RichTextRendererOptions,
  ): React.ReactNode {
    const { children, language } = node

    const codeContent = children ? extractTextFromNodes(children) : ""

    return (
      <Code
        data-language={language}
        display="block"
        fontFamily="mono"
        fontSize="sm"
        key={key}
        whiteSpace="pre"
      >
        {codeContent}
      </Code>
    )
  }
}

/**
 * Singleton instance for convenience
 */
export const richTextRenderer = new RichTextRenderer()
