import { z } from "zod"
import { createApiClient } from "../client"

global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe("ApiClient URL joining", () => {
  let client: ReturnType<typeof createApiClient>
  const testSchema = z.object({ message: z.string() })
  const mockResponse = { message: "success" }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    mockFetch.mockResolvedValue(new Response(JSON.stringify(mockResponse)))
  })

  it("should handle base URL with trailing slash and path with leading slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/")
    client = createApiClient()

    await client.get("/users", testSchema)

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", expect.any(Object))
  })

  it("should handle base URL without trailing slash and path without leading slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
    client = createApiClient()

    await client.get("users", testSchema)

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", expect.any(Object))
  })

  it("should handle base URL with trailing slash and path without leading slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/")
    client = createApiClient()

    await client.get("users", testSchema)

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", expect.any(Object))
  })

  it("should handle base URL without trailing slash and path with leading slash", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
    client = createApiClient()

    await client.get("/users", testSchema)

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", expect.any(Object))
  })

  it("should handle multiple trailing slashes in base URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com///")
    client = createApiClient()

    await client.get("/users", testSchema)

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", expect.any(Object))
  })

  it("should handle multiple leading slashes in path", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
    client = createApiClient()

    await client.get("///users", testSchema)

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/users", expect.any(Object))
  })

  it("should handle complex path with subdirectories", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/")
    client = createApiClient()

    await client.get("/api/v1/users/123", testSchema)

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/api/v1/users/123",
      expect.any(Object),
    )
  })

  it("should handle empty path", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/")
    client = createApiClient()

    await client.get("", testSchema)

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/", expect.any(Object))
  })

  it("should work consistently across all HTTP methods", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/")
    client = createApiClient()

    await client.get("/test", testSchema)
    await client.post("/test", {}, testSchema)
    await client.put("/test", {}, testSchema)
    await client.patch("/test", {}, testSchema)
    await client.delete("/test", testSchema)

    expect(mockFetch).toHaveBeenCalledTimes(5)
    mockFetch.mock.calls.forEach((call) => {
      expect(call[0]).toBe("https://api.example.com/test")
    })
  })

  describe("search parameters", () => {
    it("should handle simple query parameters", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/users?limit=10&page=1", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users?limit=10&page=1",
        expect.any(Object),
      )
    })

    it("should handle query parameters with base URL having trailing slash", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/")
      client = createApiClient()

      await client.get("/users?limit=10&page=1", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users?limit=10&page=1",
        expect.any(Object),
      )
    })

    it("should handle query parameters with path without leading slash", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("users?limit=10&page=1", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users?limit=10&page=1",
        expect.any(Object),
      )
    })

    it("should handle complex query parameters with special characters", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/search?q=hello%20world&filter=active&sort=name", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/search?q=hello%20world&filter=active&sort=name",
        expect.any(Object),
      )
    })

    it("should handle query parameters with empty values", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/users?limit=&page=1&empty=", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users?limit=&page=1&empty=",
        expect.any(Object),
      )
    })

    it("should handle query parameters with boolean values", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/users?active=true&verified=false", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users?active=true&verified=false",
        expect.any(Object),
      )
    })

    it("should handle query parameters with array-like values", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/users?tags[]=admin&tags[]=user&roles=admin,user", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users?tags[]=admin&tags[]=user&roles=admin,user",
        expect.any(Object),
      )
    })

    it("should handle query parameters with complex path", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/api/v1/users/123/posts?limit=5&offset=10", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/api/v1/users/123/posts?limit=5&offset=10",
        expect.any(Object),
      )
    })

    it("should handle query parameters with hash fragments", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/users?page=1#section", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users?page=1#section",
        expect.any(Object),
      )
    })

    it("should work with query parameters across all HTTP methods", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/users?limit=10", testSchema)
      await client.post("/users?validate=true", {}, testSchema)
      await client.put("/users/123?update=true", {}, testSchema)
      await client.patch("/users/123?partial=true", {}, testSchema)
      await client.delete("/users/123?soft=true", testSchema)

      expect(mockFetch).toHaveBeenCalledTimes(5)
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        "https://api.example.com/users?limit=10",
        expect.any(Object),
      )
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        "https://api.example.com/users?validate=true",
        expect.any(Object),
      )
      expect(mockFetch).toHaveBeenNthCalledWith(
        3,
        "https://api.example.com/users/123?update=true",
        expect.any(Object),
      )
      expect(mockFetch).toHaveBeenNthCalledWith(
        4,
        "https://api.example.com/users/123?partial=true",
        expect.any(Object),
      )
      expect(mockFetch).toHaveBeenNthCalledWith(
        5,
        "https://api.example.com/users/123?soft=true",
        expect.any(Object),
      )
    })

    it("should handle edge case with only query parameters and no path", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("?limit=10&page=1", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/?limit=10&page=1",
        expect.any(Object),
      )
    })

    it("should handle edge case with only query parameters and leading slash", async () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()

      await client.get("/?limit=10&page=1", testSchema)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/?limit=10&page=1",
        expect.any(Object),
      )
    })
  })
})
