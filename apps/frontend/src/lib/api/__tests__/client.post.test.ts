import { StatusCodes } from "http-status-codes"
import { z } from "zod"
import { ApiClientError } from "../ApiClientError"
import { createApiClient } from "../client"

global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe("ApiClient POST method", () => {
  let client: ReturnType<typeof createApiClient>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
    client = createApiClient()
  })

  it("should successfully post and parse data", async () => {
    const testSchema = z.object({ message: z.string(), id: z.number() })
    const mockResponse = { message: "created", id: 1 }
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
    const result = await client.post("/test", { foo: "bar" }, testSchema, {
      tags: ["postTag"],
    })
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/test",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foo: "bar" }),
        next: { tags: ["postTag"] },
      }),
    )
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      status: StatusCodes.OK,
    })
  })

  it("should return error when response is not ok", async () => {
    const testSchema = z.object({ message: z.string() })
    const errorResponse = { error: "Invalid request data" }
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(errorResponse), { status: 400, statusText: "Bad Request" }),
    )
    const result = await client.post("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Invalid request data")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("POST")
        expect(result.error.url).toBe("https://api.example.com/test")
        expect(result.error.status).toBe(400)
      }
    }
  })

  it("should return error when schema validation fails", async () => {
    const testSchema = z.object({ message: z.string(), id: z.number() })
    const invalidResponse = { message: "created" } // missing id
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
    const result = await client.post("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Invalid response format")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("POST")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
    }
  })

  it("should handle network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const result = await client.post("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Network error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("POST")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
      expect(result.status).toBe(null)
    }
  })

  it("should handle non-Error network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce("String error")

    const result = await client.post("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Network error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("POST")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
      expect(result.status).toBe(null)
    }
  })

  it("should throw error when requiresAuth is true but no token is available", async () => {
    const testSchema = z.object({ message: z.string() })

    // Mock localStorage to return null (no token)
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
      },
      writable: true,
    })

    const result = await client.post("/test", { foo: "bar" }, testSchema, {
      requiresAuth: true,
      token: null,
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Network error")
      if (result.error instanceof ApiClientError && result.error.originalError instanceof Error) {
        expect(result.error.originalError.message).toBe("No token provided")
      }
    }
  })

  it("should include Authorization header when requiresAuth is true and token exists", async () => {
    const testSchema = z.object({ message: z.string() })
    const mockResponse = { message: "created" }
    const mockToken = "test-jwt-token"

    // Mock localStorage to return a token
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: vi.fn(() => mockToken),
      },
      writable: true,
    })

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

    const result = await client.post("/test", { foo: "bar" }, testSchema, {
      requiresAuth: true,
      token: mockToken,
    })

    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify({ foo: "bar" }),
      next: {
        tags: [],
      },
    })
    expect(result.success).toBe(true)
  })
})
