/**
 * Type representing query parameters that can be serialized to URL search params
 *
 * This type defines the structure for query parameters that can be converted
 * to URL search parameters. It supports primitive values, arrays, and null/undefined
 * values which are filtered out during serialization.
 */
export type SerializableQuery = Record<string, unknown>

/**
 * Serializes query parameters into a URL search string
 *
 * Converts a query parameters object into a properly formatted URL search string.
 * Handles arrays by joining values with commas, filters out null and undefined
 * values, and converts all values to strings.
 *
 * @param params The query parameters object to serialize
 * @returns URL search string (e.g., "key1=value1&key2=value2")
 *
 * @example
 * ```ts
 * // Basic usage
 * serializeQuery({ name: "John", age: 25 })
 * // Returns: "name=John&age=25"
 *
 * // With arrays
 * serializeQuery({ tags: ["js", "ts"], active: true })
 * // Returns: "tags=js,ts&active=true"
 *
 * // With null values (filtered out)
 * serializeQuery({ name: "John", email: null, age: 30 })
 * // Returns: "name=John&age=30"
 * ```
 */
const serializeQuery = (params: SerializableQuery): string => {
  const search = new URLSearchParams()
  for (const [key, raw] of Object.entries(params)) {
    if (raw == null) continue
    if (Array.isArray(raw)) {
      const filteredValues = raw.filter((v) => v != null).map(String)
      if (filteredValues.length > 0) {
        search.append(key, filteredValues.join(","))
      }
    } else {
      search.append(key, String(raw))
    }
  }
  return search.toString()
}

/**
 * Builds an external URL with query parameters
 *
 * Constructs a complete external URL by appending query parameters to a base URL.
 * Handles existing query parameters and hash fragments properly, ensuring the
 * resulting URL is correctly formatted.
 *
 * @param base The base URL to append query parameters to
 * @param params Query parameters to append to the URL
 * @returns Complete URL with query parameters
 *
 * @example
 * ```ts
 * // Basic usage
 * buildExternalHref("https://api.example.com/users", { page: 1, limit: 10 })
 * // Returns: "https://api.example.com/users?page=1&limit=10"
 *
 * // With existing query parameters
 * buildExternalHref("https://api.example.com/users?sort=name", { page: 1 })
 * // Returns: "https://api.example.com/users?sort=name&page=1"
 *
 * // With hash fragment
 * buildExternalHref("https://example.com/page#section", { id: 123 })
 * // Returns: "https://example.com/page?id=123#section"
 *
 * // With no parameters
 * buildExternalHref("https://example.com", {})
 * // Returns: "https://example.com"
 * ```
 */
export const buildExternalHref = (base: string, params: SerializableQuery): string => {
  const qs = serializeQuery(params)
  if (!qs) return base

  const hashIndex = base.indexOf("#")
  const hasHash = hashIndex !== -1
  const urlWithoutHash = hasHash ? base.slice(0, hashIndex) : base
  const hash = hasHash ? base.slice(hashIndex) : ""

  const separator = urlWithoutHash.includes("?") ? "&" : "?"
  return `${urlWithoutHash}${separator}${qs}${hash}`
}
