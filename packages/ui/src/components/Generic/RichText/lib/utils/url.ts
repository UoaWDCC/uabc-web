/**
 * Resolves relative URLs with a base URL for media assets
 *
 * This utility function combines a base URL with a relative path to create
 * absolute URLs for media assets from a CMS. It handles cases where the URL
 * is already absolute or when no base URL is provided.
 *
 * @param url - The relative or absolute URL to resolve
 * @param baseUrl - Optional base URL to prepend to relative URLs
 * @returns The resolved absolute URL, or the original URL if already absolute
 *
 * @example
 * ```tsx
 * // With relative URL and base URL
 * resolveUrl("/image.jpg", "https://api.example.com")
 * // Returns: "https://api.example.com/image.jpg"
 *
 * // With already absolute URL
 * resolveUrl("https://cdn.example.com/image.jpg", "https://api.example.com")
 * // Returns: "https://cdn.example.com/image.jpg"
 *
 * // Without base URL
 * resolveUrl("/image.jpg")
 * // Returns: "/image.jpg"
 * ```
 */
export const resolveUrl = (url: string, baseUrl?: string): string => {
  // If no base URL provided or URL is already absolute, return as is
  if (!baseUrl || url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) {
    return url
  }

  // Remove trailing slash from base URL and leading slash from path if present
  const cleanBaseUrl = baseUrl.replace(/\/$/, "")
  const cleanPath = url.startsWith("/") ? url : `/${url}`

  return `${cleanBaseUrl}${cleanPath}`
}
