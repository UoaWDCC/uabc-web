import { Text } from "@yamada-ui/react"
import { Link } from "@yamada-ui/react"
import NextLink from "next/link"
import type React from "react"
import type { RichTextRendererOptions, SerializedLexicalNode, SerializedLinkNode } from "../types"
import { isDocumentWithSlug, isValidLinkFields } from "../utils"

type RenderInlineNodes = (
  nodes: SerializedLexicalNode[],
  options: RichTextRendererOptions,
) => React.ReactNode

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
        {renderInlineNodes(children, options)}
      </Text>
    )
  }

  return (
    <Link as={NextLink} external={external} href={href} key={key} {...options.linkProps}>
      {renderInlineNodes(children, options)}
    </Link>
  )
}
