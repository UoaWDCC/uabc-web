import { Code } from "@yamada-ui/react"
import type React from "react"
import type { RichTextRendererOptions, SerializedCodeNode } from "../types"
import { extractTextFromNodes } from "../utils"

export const renderCodeNode = (
  node: SerializedCodeNode,
  key: string,
  _options: RichTextRendererOptions,
): React.ReactNode => {
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
