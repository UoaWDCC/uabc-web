import type { SerializedLexicalNode } from "../types"
import { hasChildren, isTextNode } from "./guards"

/**
 * Extract plain text from an array of nodes (for code blocks, search indexing, etc.)
 */
export const extractTextFromNodes = (nodes: SerializedLexicalNode[]): string => {
  let text = ""
  for (const node of nodes) {
    if (isTextNode(node)) {
      text += node.text || ""
    } else if (hasChildren(node)) {
      text += extractTextFromNodes(node.children)
    }
  }
  return text
}

/**
 * Create URL-friendly anchor from text
 */
export const createAnchor = (text: string): string => {
  return text
    .trim() // Remove leading/trailing whitespace first
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
}

/**
 * Generate unique key for React rendering
 */
export const createNodeKey = (() => {
  let counter = 0
  return (): string => `node-${++counter}`
})()
