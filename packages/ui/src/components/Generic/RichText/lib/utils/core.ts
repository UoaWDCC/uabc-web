import type { SerializedLexicalNode } from "@repo/shared"
import { hasChildren, isTextNode } from "./validators"

/**
 * Extracts plain text content from an array of Lexical nodes
 *
 * This utility function recursively traverses through nodes to extract all text content,
 * which is useful for creating search indexes, code block content extraction, or
 * generating plain text summaries of rich content.
 *
 * @param nodes - Array of Lexical nodes to extract text from
 * @returns Concatenated plain text string from all text nodes
 *
 * @example
 * ```tsx
 * const nodes = [
 *   { type: 'text', text: 'Hello ' },
 *   { type: 'paragraph', children: [{ type: 'text', text: 'world!' }] }
 * ]
 * const text = extractTextFromNodes(nodes) // "Hello world!"
 * ```
 */
export const extractTextFromNodes = (nodes: SerializedLexicalNode[]): string => {
  let text = ""
  for (const node of nodes) {
    if (isTextNode(node)) {
      text += node.text
    } else if (hasChildren(node)) {
      text += extractTextFromNodes(node.children)
    }
  }
  return text
}

/**
 * Creates a URL-friendly anchor string from text content
 *
 * Converts text into a format suitable for URL fragments or IDs by removing
 * special characters, converting to lowercase, and replacing spaces with hyphens.
 * Useful for creating table of contents links or section anchors.
 *
 * @param text - The input text to convert to an anchor
 * @returns URL-friendly anchor string
 *
 * @example
 * ```tsx
 * createAnchor("Hello World!") // "hello-world"
 * createAnchor("  Special @#$ Characters  ") // "special-characters"
 * createAnchor("Multiple   Spaces") // "multiple-spaces"
 * ```
 */
export const createAnchor = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
}

/**
 * Generates unique keys for React element rendering
 *
 * This function provides a simple counter-based unique key generator for React
 * elements. Each call returns a new unique key in the format "node-{number}".
 *
 * @returns Unique string key for React elements
 *
 * @example
 * ```tsx
 * const key1 = createNodeKey() // "node-1"
 * const key2 = createNodeKey() // "node-2"
 *
 * // Usage in rendering
 * <Text key={createNodeKey()}>Content</Text>
 * ```
 */
export const createNodeKey = (() => {
  let counter = 0
  return (): string => `node-${++counter}`
})()
