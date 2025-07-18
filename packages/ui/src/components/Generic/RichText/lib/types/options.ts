import type { SerializedEditorState, SerializedLexicalNode } from "@repo/shared"
import type {
  CodeProps,
  HeadingProps,
  ImageProps,
  LinkProps,
  ListProps,
  ListItemProps,
  TextProps,
} from "@yamada-ui/react"
import type React from "react"

export interface RichTextRendererOptions {
  textProps?: Partial<TextProps>
  headingProps?: Partial<HeadingProps>
  linkProps?: Partial<LinkProps>
  imageProps?: Partial<ImageProps>
  codeProps?: Partial<CodeProps>
  listProps?: Partial<ListProps>
  listItemProps?: Partial<ListItemProps>
  /**
   * Base URL for resolving relative media URLs from the backend
   * @example "https://api.example.com" or process.env.NEXT_PUBLIC_API_URL
   */
  mediaBaseUrl?: string
  customComponents?: {
    [nodeType: string]: React.ComponentType<{
      node: SerializedLexicalNode
      children?: React.ReactNode
    }>
  }
}

export interface RichTextProps extends RichTextRendererOptions {
  data: SerializedEditorState
  fallback?: React.ReactNode
}
