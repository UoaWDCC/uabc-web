import { Image } from "@repo/ui/components/Image"
import type React from "react"
import type { RichTextRendererOptions, SerializedUploadNode } from "../types"
import { isMediaDocument, resolveUrl } from "../utils"

export const renderUploadNode = (
  node: SerializedUploadNode,
  key: string,
  options: RichTextRendererOptions,
): React.ReactNode => {
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

  const resolvedUrl = resolveUrl(url, options.mediaBaseUrl)

  return (
    <Image
      alt={alt || ""}
      height={height || 200}
      key={key}
      maxW="full"
      src={resolvedUrl}
      width={width || 300}
      {...options.imageProps}
    />
  )
}
