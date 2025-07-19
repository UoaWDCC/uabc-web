import type { Media } from "@repo/shared/payload-types"

/**
 * Extracts the URL from an image property that can be either a string or Media object
 */
export const getImageUrl = (image: string | Media | null | undefined): string | undefined => {
  if (!image) return undefined
  if (typeof image === "string") return image
  return image.url ?? undefined
}
