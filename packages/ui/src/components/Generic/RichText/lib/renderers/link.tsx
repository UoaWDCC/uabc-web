import { Link, Text } from "@yamada-ui/react"
import NextLink from "next/link"
import type React from "react"
import { LinkType } from "../constants"
import type { RichTextRendererOptions, SerializedLexicalNode, SerializedLinkNode } from "../types"
import { isDocumentWithSlug, isLinkDocument, isValidLinkFields } from "../utils"

type RenderInlineNodes = (
  nodes: SerializedLexicalNode[],
  options: RichTextRendererOptions,
) => React.ReactNode

/**
 * Renders a link node as either a Link component or plain text
 *
 * This function handles both external (custom) and internal links. For external
 * links, it uses the provided URL. For internal links, it resolves document
 * references to generate proper routes. If the link configuration is invalid,
 * it falls back to rendering plain text.
 *
 * @param node - The link node containing fields (URL, document reference) and children
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options including linkProps for styling customization
 * @param renderInlineNodes - Function to render the link's child content
 * @returns Link component for valid links, or Text component for invalid links
 *
 * @example
 * ```tsx
 * // External link
 * const externalLinkNode = {
 *   type: 'link',
 *   fields: { linkType: 'custom', url: 'https://example.com', newTab: true },
 *   children: [{ type: 'text', text: 'Visit Site' }]
 * }
 *
 * // Internal link
 * const internalLinkNode = {
 *   type: 'link',
 *   fields: { linkType: 'internal', doc: { id: '1', slug: 'about' } },
 *   children: [{ type: 'text', text: 'About Us' }]
 * }
 *
 * const element = renderLinkNode(
 *   externalLinkNode,
 *   'link-1',
 *   { linkProps: { color: 'blue.500' } },
 *   renderInlineNodes
 * )
 * ```
 */
export const renderLinkNode = (
  node: SerializedLinkNode,
  key: string,
  options: RichTextRendererOptions,
  renderInlineNodes: RenderInlineNodes,
): React.ReactNode => {
  const { fields, children } = node

  if (!isValidLinkFields(fields)) {
    return (
      <Text as="span" key={key}>
        {renderInlineNodes(children, options)}
      </Text>
    )
  }

  let href: string | undefined
  let external = false

  if (fields.linkType === LinkType.CUSTOM && fields.url) {
    href = fields.url
    external = fields.newTab || false
  } else if (fields.linkType === LinkType.INTERNAL && fields.doc) {
    const doc = fields.doc
    if (isDocumentWithSlug(doc)) {
      href = `/${doc.slug}`
      external = fields.newTab || false
    } else if (isLinkDocument(doc)) {
      href = `/${doc.value.slug}`
      external = fields.newTab || false
    }
  }

  if (!href) {
    return (
      <Text as="span" key={key}>
        {renderInlineNodes(children, options)}
      </Text>
    )
  }

  return (
    <Link
      as={NextLink}
      external={external}
      href={href}
      key={key}
      rel={external ? "noopener noreferrer" : undefined}
      {...options.linkProps}
    >
      {renderInlineNodes(children, options)}
    </Link>
  )
}
