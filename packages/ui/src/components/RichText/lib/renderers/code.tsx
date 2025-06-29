import { Code } from "@yamada-ui/react"
import type React from "react"
import type { RichTextRendererOptions, SerializedCodeNode } from "../types"
import { extractTextFromNodes } from "../utils"

export const renderCodeNode = (
  node: SerializedCodeNode,
  options: RichTextRendererOptions,
): React.ReactNode => {
  const { children, language } = node

  const codeContent = children ? extractTextFromNodes(children) : ""

  return (
    <Code
      data-language={language}
      fontFamily="mono"
      fontSize="sm"
      whiteSpace="pre"
      {...options.codeProps}
    >
      {codeContent}
    </Code>
  )
}
