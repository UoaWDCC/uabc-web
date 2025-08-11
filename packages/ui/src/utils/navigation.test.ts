import { NavigationUtils } from "./navigation"

describe("NavigationUtils", () => {
  describe("buildInternalUrl", () => {
    it("should return the href when no query is provided", () => {
      expect(NavigationUtils.buildInternalUrl("/test")).toBe("/test")
      expect(NavigationUtils.buildInternalUrl("/test", {})).toBe("/test")
    })

    it("should build URL with single query parameter", () => {
      expect(NavigationUtils.buildInternalUrl("/auth/login", { returnUrl: "/book" })).toBe(
        "/auth/login?returnUrl=%2Fbook",
      )
    })

    it("should build URL with multiple query parameters", () => {
      expect(NavigationUtils.buildInternalUrl("/search", { q: "tennis", category: "sports" })).toBe(
        "/search?q=tennis&category=sports",
      )
    })

    it("should handle array parameters", () => {
      expect(NavigationUtils.buildInternalUrl("/search", { filters: ["indoor", "evening"] })).toBe(
        "/search?filters=indoor,evening",
      )
    })

    it("should filter out null and empty values", () => {
      expect(
        NavigationUtils.buildInternalUrl("/search", {
          q: "tennis",
          category: "",
          filters: [null, "indoor", undefined, "evening"],
          empty: null,
        }),
      ).toBe("/search?q=tennis&filters=indoor,evening")
    })

    it("should handle external URLs", () => {
      const result = NavigationUtils.buildInternalUrl("https://example.com", { q: "test" })
      expect(result).toContain("https://example.com")
      expect(result).toContain("q=test")
    })

    it("should handle special characters in query parameters", () => {
      expect(NavigationUtils.buildInternalUrl("/search", { q: "tennis & badminton" })).toBe(
        "/search?q=tennis+%26+badminton",
      )
    })
  })

  describe("extractSearchParams", () => {
    it("should extract search parameters from a URL", () => {
      const result = NavigationUtils.extractSearchParams(
        "/auth/login?returnUrl=%2Fbook&other=value",
      )
      expect(result).toEqual({ returnUrl: "/book", other: "value" })
    })

    it("should handle URLs without search parameters", () => {
      const result = NavigationUtils.extractSearchParams("/auth/login")
      expect(result).toEqual({})
    })

    it("should handle malformed URLs gracefully", () => {
      const result = NavigationUtils.extractSearchParams("invalid-url")
      expect(result).toEqual({})
    })

    it("should handle empty URL", () => {
      const result = NavigationUtils.extractSearchParams("")
      expect(result).toEqual({})
    })

    it("should handle URLs with duplicate parameters", () => {
      const result = NavigationUtils.extractSearchParams("/search?q=tennis&q=badminton")
      expect(result).toEqual({ q: "badminton" }) // Last value wins
    })
  })

  describe("decodeUrlParam", () => {
    it("should decode URL-encoded strings", () => {
      expect(NavigationUtils.decodeUrlParam("%2Fbook")).toBe("/book")
      expect(NavigationUtils.decodeUrlParam("tennis%20%26%20badminton")).toBe("tennis & badminton")
    })

    it("should return original string if decoding fails", () => {
      expect(NavigationUtils.decodeUrlParam("%invalid")).toBe("%invalid")
    })

    it("should handle empty string", () => {
      expect(NavigationUtils.decodeUrlParam("")).toBe("")
    })

    it("should handle already decoded strings", () => {
      expect(NavigationUtils.decodeUrlParam("/book")).toBe("/book")
    })
  })

  describe("encodeUrlParam", () => {
    it("should encode strings for URL usage", () => {
      expect(NavigationUtils.encodeUrlParam("/book")).toBe("%2Fbook")
      expect(NavigationUtils.encodeUrlParam("tennis & badminton")).toBe("tennis%20%26%20badminton")
    })

    it("should handle empty string", () => {
      expect(NavigationUtils.encodeUrlParam("")).toBe("")
    })

    it("should handle already encoded strings", () => {
      expect(NavigationUtils.encodeUrlParam("%2Fbook")).toBe("%252Fbook")
    })

    it("should handle special characters", () => {
      expect(NavigationUtils.encodeUrlParam("a/b?c=d&e=f")).toBe("a%2Fb%3Fc%3Dd%26e%3Df")
    })
  })

  describe("isExternalUrl", () => {
    const originalLocation = window.location

    beforeEach(() => {
      Object.defineProperty(window, "location", {
        value: {
          ...originalLocation,
          origin: "https://example.com",
        },
        writable: true,
      })
    })

    afterEach(() => {
      Object.defineProperty(window, "location", {
        value: originalLocation,
        writable: true,
      })
    })

    it("should identify external URLs", () => {
      expect(NavigationUtils.isExternalUrl("https://google.com")).toBe(true)
      expect(NavigationUtils.isExternalUrl("http://other.com")).toBe(true)
      expect(NavigationUtils.isExternalUrl("//cdn.example.com")).toBe(true)
    })

    it("should identify internal URLs", () => {
      expect(NavigationUtils.isExternalUrl("/auth/login")).toBe(false)
      expect(NavigationUtils.isExternalUrl("/book")).toBe(false)
      expect(NavigationUtils.isExternalUrl("book")).toBe(false)
    })

    it("should handle same-origin URLs", () => {
      expect(NavigationUtils.isExternalUrl("https://example.com/book")).toBe(false)
      expect(NavigationUtils.isExternalUrl("https://example.com")).toBe(false)
    })

    it("should handle malformed URLs", () => {
      expect(NavigationUtils.isExternalUrl("invalid-url")).toBe(false)
    })

    it("should work in server-side environment", () => {
      const originalWindow = global.window
      delete (global as unknown as Record<string, unknown>).window

      expect(NavigationUtils.isExternalUrl("https://google.com")).toBe(true)
      expect(NavigationUtils.isExternalUrl("/book")).toBe(false)

      global.window = originalWindow
    })
  })

  describe("normalizeUrl", () => {
    it("should normalize relative URLs", () => {
      expect(NavigationUtils.normalizeUrl("book")).toBe("/book")
      expect(NavigationUtils.normalizeUrl("/book")).toBe("/book")
      expect(NavigationUtils.normalizeUrl("/book/")).toBe("/book")
    })

    it("should handle root URL", () => {
      expect(NavigationUtils.normalizeUrl("")).toBe("/")
      expect(NavigationUtils.normalizeUrl("/")).toBe("/")
    })

    it("should preserve external URLs", () => {
      expect(NavigationUtils.normalizeUrl("https://example.com")).toBe("https://example.com")
      expect(NavigationUtils.normalizeUrl("https://example.com/book")).toBe(
        "https://example.com/book",
      )
    })

    it("should handle complex paths", () => {
      expect(NavigationUtils.normalizeUrl("/auth/login/")).toBe("/auth/login")
      expect(NavigationUtils.normalizeUrl("auth/login")).toBe("/auth/login")
    })

    it("should handle empty strings", () => {
      expect(NavigationUtils.normalizeUrl("")).toBe("/")
    })
  })
})
