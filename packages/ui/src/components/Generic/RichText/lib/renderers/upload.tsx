import type { SerializedUploadNode } from "@repo/shared"
import { Image } from "@repo/ui/components/Primitive"
import type React from "react"
import type { RichTextRendererOptions } from "../types"
import { isMediaDocument, resolveUrl } from "../utils"

/**
 * Renders an upload node as an Image component for media assets
 *
 * This function handles media uploads from Payload CMS, specifically images.
 * It validates that the relation is to media collection, checks for valid
 * media documents, and resolves URLs using the provided media base URL.
 * Only renders images with valid URLs and returns null for other cases.
 *
 * @param node - The upload node containing relationTo and value (media document)
 * @param key - Unique React key for the rendered element
 * @param options - Rendering options including imageProps and mediaBaseUrl
 * @returns Image component for valid media uploads, or null for invalid/non-media uploads
 *
 * @example
 * ```tsx
 * const uploadNode = {
 *   type: 'upload',
 *   relationTo: 'media',
 *   value: {
 *     id: '123',
 *     url: '/uploads/image.jpg',
 *     alt: 'Sample image',
 *     width: 800,
 *     height: 600
 *   }
 * }
 *
 * const element = renderUploadNode(uploadNode, 'upload-1', {
 *   mediaBaseUrl: 'https://api.example.com',
 *   imageProps: { borderRadius: 'md' }
 * })
 * ```
 */
export const renderUploadNode = (
  node: SerializedUploadNode,
  key: string,
  options: RichTextRendererOptions,
): React.ReactNode => {
  if (node.relationTo !== "media") {
    return null
  }

  const uploadDoc = node.value

  if (!isMediaDocument(uploadDoc) || !uploadDoc.url) {
    return null
  }

  const { alt, url, width, height } = uploadDoc

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
