import type { SearchParamsFor } from "@repo/shared"
import { buildExternalHref } from "./url"

/**
 * Navigation utility for handling routes with search parameters
 *
 * This utility provides type-safe methods for building and manipulating URLs
 * in Next.js applications, following Next.js App Router patterns.
 *
 * For client-side navigation, prefer Next.js hooks:
 * - useRouter() for navigation
 * - useSearchParams() for reading search params
 * - usePathname() for current pathname
 */
export class NavigationUtils {
  /**
   * Builds a URL with search parameters for internal routes
   *
   * @param href The base route
   * @param query Search parameters to append
   * @returns Complete URL with search parameters
   *
   * @example
   * ```ts
   * buildInternalUrl("/auth/login", { returnUrl: "/book" })
   * // Returns: "/auth/login?returnUrl=%2Fbook"
   *
   * buildInternalUrl("/search", { q: "tennis", filters: ["indoor", "evening"] })
   * // Returns: "/search?q=tennis&filters=indoor,evening"
   * ```
   */
  static buildInternalUrl<T extends string>(href: T, query?: SearchParamsFor<T>): string {
    if (!query || Object.keys(query).length === 0) {
      return href
    }

    // Handle external URLs using the existing utility
    if (!href.startsWith("/")) {
      return buildExternalHref(href, query as Record<string, unknown>)
    }

    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(query)) {
      if (value == null || value === "") {
        continue
      }

      if (Array.isArray(value)) {
        const filteredValues = value.filter((v) => v != null && v !== "").map(String)
        if (filteredValues.length > 0) {
          searchParams.append(key, filteredValues.join(","))
        }
      } else {
        searchParams.append(key, String(value))
      }
    }

    const queryString = searchParams.toString()
    return queryString ? `${href}?${queryString}` : href
  }

  /**
   * Extracts search parameters from a URL string
   *
   * Note: For client-side usage, prefer Next.js useSearchParams() hook
   *
   * @param url The URL to parse
   * @returns Object containing search parameters
   *
   * @example
   * ```ts
   * extractSearchParams("/auth/login?returnUrl=%2Fbook&other=value")
   * // Returns: { returnUrl: "/book", other: "value" }
   * ```
   */
  static extractSearchParams(url: string): Record<string, string> {
    try {
      // Handle relative URLs by creating a proper URL object
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost"
      const urlObj = new URL(url, baseUrl)
      const params: Record<string, string> = {}

      for (const [key, value] of urlObj.searchParams.entries()) {
        params[key] = value
      }

      return params
    } catch (error) {
      console.warn("Failed to extract search params from URL:", url, error)
      return {}
    }
  }

  /**
   * Gets a specific search parameter from the current URL
   *
   * ⚠️ DEPRECATED: Use Next.js useSearchParams() hook instead
   * This method is client-side only and may cause hydration issues.
   *
   * @param key The parameter key to retrieve
   * @returns The parameter value or null if not found
   *
   * @example
   * ```ts
   * // ❌ Don't use this in components
   * const returnUrl = NavigationUtils.getSearchParam("returnUrl")
   *
   * // ✅ Use this instead
   * const searchParams = useSearchParams()
   * const returnUrl = searchParams.get("returnUrl")
   * ```
   */
  static getSearchParam(key: string): string | null {
    if (typeof window === "undefined") {
      console.warn("getSearchParam called on server side. Use useSearchParams hook instead.")
      return null
    }

    try {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get(key)
    } catch (error) {
      console.warn("Failed to get search param:", key, error)
      return null
    }
  }

  /**
   * Safely decodes a URL-encoded string
   *
   * @param encodedString The URL-encoded string to decode
   * @returns The decoded string or the original string if decoding fails
   *
   * @example
   * ```ts
   * decodeUrlParam("%2Fbook")
   * // Returns: "/book"
   * ```
   */
  static decodeUrlParam(encodedString: string): string {
    try {
      return decodeURIComponent(encodedString)
    } catch (error) {
      console.warn("Failed to decode URL parameter:", encodedString, error)
      return encodedString
    }
  }

  /**
   * Safely encodes a string for URL usage
   *
   * @param value The string to encode
   * @returns The URL-encoded string
   *
   * @example
   * ```ts
   * encodeUrlParam("/book")
   * // Returns: "%2Fbook"
   * ```
   */
  static encodeUrlParam(value: string): string {
    try {
      return encodeURIComponent(value)
    } catch (error) {
      console.warn("Failed to encode URL parameter:", value, error)
      return value
    }
  }

  /**
   * Checks if a URL is external (not relative to the current domain)
   *
   * @param url The URL to check
   * @returns True if the URL is external
   *
   * @example
   * ```ts
   * isExternalUrl("https://google.com") // true
   * isExternalUrl("/auth/login") // false
   * ```
   */
  static isExternalUrl(url: string): boolean {
    if (typeof window === "undefined") {
      return !url.startsWith("/")
    }

    try {
      const urlObj = new URL(url, window.location.origin)
      return urlObj.origin !== window.location.origin
    } catch {
      return !url.startsWith("/")
    }
  }

  /**
   * Normalizes a URL by ensuring it has the correct format
   *
   * @param url The URL to normalize
   * @returns The normalized URL
   *
   * @example
   * ```ts
   * normalizeUrl("book") // "/book"
   * normalizeUrl("/book/") // "/book"
   * normalizeUrl("https://example.com/book") // "https://example.com/book"
   * ```
   */
  static normalizeUrl(url: string): string {
    if (!url) {
      return "/"
    }

    // Handle external URLs
    if (NavigationUtils.isExternalUrl(url)) {
      return url
    }

    // Ensure relative URLs start with /
    const normalized = url.startsWith("/") ? url : `/${url}`

    // Remove trailing slash for internal routes (except root)
    return normalized === "/" ? normalized : normalized.replace(/\/$/, "")
  }

  /**
   * Creates a Next.js router-compatible search params object
   *
   * This is useful when you need to create search params for use with
   * Next.js router methods like router.push() or router.replace()
   *
   * @param params Object containing search parameters
   * @returns URLSearchParams object compatible with Next.js router
   *
   * @example
   * ```ts
   * const searchParams = NavigationUtils.createSearchParams({
   *   returnUrl: "/book",
   *   filters: ["indoor", "evening"]
   * })
   * router.push(`/auth/login?${searchParams.toString()}`)
   * ```
   */
  static createSearchParams(
    params: Record<string, string | string[] | number | boolean | null | undefined>,
  ): URLSearchParams {
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value == null || value === "") {
        continue
      }

      if (Array.isArray(value)) {
        const filteredValues = value.filter((v) => v != null && v !== "").map(String)
        if (filteredValues.length > 0) {
          searchParams.append(key, filteredValues.join(","))
        }
      } else {
        searchParams.append(key, String(value))
      }
    }

    return searchParams
  }
}
