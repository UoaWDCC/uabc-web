import { Separator } from "@yamada-ui/react"
import type React from "react"

/**
 * Renders a line break node as a br element
 *
 * This function creates a simple HTML br element for line breaks within
 * inline content. It's typically used within paragraphs or other text
 * containers to create manual line breaks.
 *
 * @param key - Unique React key for the rendered element
 * @returns HTML br element for line break
 *
 * @example
 * ```tsx
 * const lineBreak = renderLineBreakNode('break-1')
 * // Renders: <br key="break-1" />
 * ```
 */
export const renderLineBreakNode = (key: string): React.ReactNode => {
  return <br key={key} />
}

/**
 * Renders a horizontal rule node as a Separator component
 *
 * This function creates a horizontal rule (divider line) using Yamada UI's
 * Separator component. It's used to create visual separation between content
 * sections in rich text.
 *
 * @param key - Unique React key for the rendered element
 * @returns Separator component for horizontal rule
 *
 * @example
 * ```tsx
 * const horizontalRule = renderHorizontalRuleNode('hr-1')
 * // Renders a horizontal separator line
 * ```
 */
export const renderHorizontalRuleNode = (key: string): React.ReactNode => {
  return <Separator key={key} />
}
