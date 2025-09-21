import { buildExternalHref } from "./url"

describe("buildExternalHref", () => {
  it("should return base URL when no parameters are provided", () => {
    const base = "https://api.example.com/users"
    const params = {}

    expect(buildExternalHref(base, params)).toBe(base)
  })

  it("should append query parameters to base URL", () => {
    const base = "https://api.example.com/users"
    const params = { page: 1, limit: 10 }

    expect(buildExternalHref(base, params)).toBe("https://api.example.com/users?page=1&limit=10")
  })

  it("should handle existing query parameters in base URL", () => {
    const base = "https://api.example.com/users?sort=name"
    const params = { page: 1, limit: 10 }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/users?sort=name&page=1&limit=10",
    )
  })

  it("should handle hash fragments in base URL", () => {
    const base = "https://example.com/page#section"
    const params = { id: 123 }

    expect(buildExternalHref(base, params)).toBe("https://example.com/page?id=123#section")
  })

  it("should handle hash fragments with existing query parameters", () => {
    const base = "https://example.com/page?existing=true#section"
    const params = { id: 123 }

    expect(buildExternalHref(base, params)).toBe(
      "https://example.com/page?existing=true&id=123#section",
    )
  })

  it("should handle array parameters", () => {
    const base = "https://api.example.com/search"
    const params = { tags: ["js", "ts"], active: true }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/search?tags=js%2Cts&active=true",
    )
  })

  it("should filter out null and undefined values", () => {
    const base = "https://api.example.com/users"
    const params = { name: "John", email: null, age: 30, status: undefined }

    expect(buildExternalHref(base, params)).toBe("https://api.example.com/users?name=John&age=30")
  })

  it("should handle array with null values", () => {
    const base = "https://api.example.com/search"
    const params = { tags: ["js", null, "ts"], active: true }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/search?tags=js%2Cts&active=true",
    )
  })

  it("should handle empty array", () => {
    const base = "https://api.example.com/search"
    const params = { tags: [], active: true }

    expect(buildExternalHref(base, params)).toBe("https://api.example.com/search?active=true")
  })

  it("should handle array with all null values", () => {
    const base = "https://api.example.com/search"
    const params = { tags: [null, undefined], active: true }

    expect(buildExternalHref(base, params)).toBe("https://api.example.com/search?active=true")
  })

  it("should handle mixed array with different types", () => {
    const base = "https://api.example.com/search"
    const params = {
      tags: ["js", 42, true, "ts"],
      active: true,
    }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/search?tags=js%2C42%2Ctrue%2Cts&active=true",
    )
  })

  it("should convert all values to strings", () => {
    const base = "https://api.example.com/data"
    const params = {
      number: 42,
      boolean: true,
      string: "test",
      float: 3.14,
    }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/data?number=42&boolean=true&string=test&float=3.14",
    )
  })

  it("should handle empty string values", () => {
    const base = "https://api.example.com/search"
    const params = { name: "", query: "test" }

    expect(buildExternalHref(base, params)).toBe("https://api.example.com/search?name=&query=test")
  })

  it("should handle zero values", () => {
    const base = "https://api.example.com/data"
    const params = { count: 0, active: false }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/data?count=0&active=false",
    )
  })

  it("should handle complex nested objects (converted to string)", () => {
    const base = "https://api.example.com/data"
    const params = {
      config: { theme: "dark", lang: "en" },
      user: { id: 1, name: "John" },
    }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/data?config=%5Bobject+Object%5D&user=%5Bobject+Object%5D",
    )
  })

  it("should handle special characters in parameter values", () => {
    const base = "https://api.example.com/search"
    const params = {
      query: "hello world",
      email: "user@example.com",
      path: "/api/data",
    }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/search?query=hello+world&email=user%40example.com&path=%2Fapi%2Fdata",
    )
  })

  it("should handle special characters in parameter keys", () => {
    const base = "https://api.example.com/data"
    const params = {
      "user-name": "John",
      email_address: "john@example.com",
    }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/data?user-name=John&email_address=john%40example.com",
    )
  })

  it("should handle base URL with trailing slash", () => {
    const base = "https://api.example.com/users/"
    const params = { page: 1 }

    expect(buildExternalHref(base, params)).toBe("https://api.example.com/users/?page=1")
  })

  it("should handle base URL with multiple existing parameters", () => {
    const base = "https://api.example.com/users?sort=name&order=asc"
    const params = { page: 1, limit: 10 }

    expect(buildExternalHref(base, params)).toBe(
      "https://api.example.com/users?sort=name&order=asc&page=1&limit=10",
    )
  })

  it("should handle base URL with hash and existing parameters", () => {
    const base = "https://example.com/page?existing=true#section"
    const params = { id: 123, tab: "details" }

    expect(buildExternalHref(base, params)).toBe(
      "https://example.com/page?existing=true&id=123&tab=details#section",
    )
  })
})
