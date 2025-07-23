import { StatusCodes } from "http-status-codes"
import { z } from "zod"
import { ApiClientError, createApiClient } from "../client"

global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe("ApiClient GET method", () => {
  let client: ReturnType<typeof createApiClient>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
    client = createApiClient()
  })

  it("should successfully fetch and parse data", async () => {
    const testSchema = z.object({
      message: z.string(),
      data: z.array(z.string()),
    })

    const mockResponse = {
      message: "success",
      data: ["item1", "item2"],
    }

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

    const result = await client.get("/test", testSchema, {
      tags: ["tag1", "tag2"],
    })

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["tag1", "tag2"],
      },
    })
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      status: StatusCodes.OK,
    })
  })

  it("should handle fetch with default empty tags", async () => {
    const testSchema = z.object({ message: z.string() })
    const mockResponse = { message: "success" }

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

    const result = await client.get("/test", testSchema)

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: [],
      },
    })
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      status: StatusCodes.OK,
    })
  })

  it("should return error when response is not ok", async () => {
    const testSchema = z.object({ message: z.string() })
    const errorResponse = { error: "Resource not found" }

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(errorResponse), { status: 404, statusText: "Not Found" }),
    )

    const result = await client.get("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Resource not found")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("GET")
        expect(result.error.url).toBe("https://api.example.com/test")
        expect(result.error.status).toBe(404)
      }
      expect(result.status).toBe(404)
    }
  })

  it("should return error when schema validation fails", async () => {
    const testSchema = z.object({
      message: z.string(),
      requiredField: z.string(),
    })

    const invalidResponse = { message: "success" }

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))

    const result = await client.get("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Invalid response format")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("GET")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
    }
  })

  it("should handle network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const result = await client.get("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Network error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("GET")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
      expect(result.status).toBe(null)
    }
  })

  it("should handle custom headers", async () => {
    const testSchema = z.object({ message: z.string() })
    const mockResponse = { message: "success" }

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

    await client.get("/test", testSchema, {
      headers: { Authorization: "Bearer token" },
    })

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
      next: {
        tags: [],
      },
    })
  })

  it("should handle revalidate option", async () => {
    const testSchema = z.object({ message: z.string() })
    const mockResponse = { message: "success" }

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

    await client.get("/test", testSchema, {
      revalidate: 3600,
    })

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: [],
        revalidate: 3600,
      },
    })
  })

  it("should handle revalidate false option", async () => {
    const testSchema = z.object({ message: z.string() })
    const mockResponse = { message: "success" }

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

    await client.get("/test", testSchema, {
      revalidate: false,
    })

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: [],
        revalidate: false,
      },
    })
  })

  it("should handle error response with invalid format gracefully", async () => {
    const testSchema = z.object({ message: z.string() })
    const invalidErrorResponse = { invalidField: "This is not a valid error response" }

    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(invalidErrorResponse), {
        status: 500,
        statusText: "Internal Server Error",
      }),
    )

    const result = await client.get("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("HTTP 500: Internal Server Error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("GET")
        expect(result.error.url).toBe("https://api.example.com/test")
        expect(result.error.status).toBe(500)
      }
      expect(result.status).toBe(500)
    }
  })
})
