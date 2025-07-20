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
})
