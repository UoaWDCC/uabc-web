/**
 * Utility function to resolve relative URLs with a base URL
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
