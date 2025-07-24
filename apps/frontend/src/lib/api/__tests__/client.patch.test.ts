import { StatusCodes } from "http-status-codes"
import { z } from "zod"
import { ApiClientError } from "../ApiClientError"
import { createApiClient } from "../client"

global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe("ApiClient PATCH method", () => {
  let client: ReturnType<typeof createApiClient>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
    client = createApiClient()
  })

  it("should successfully patch and parse data", async () => {
    const testSchema = z.object({
      message: z.string(),
      patched: z.boolean(),
    })
    const mockResponse = { message: "patched", patched: true }
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
    const result = await client.patch("/test", { foo: "bar" }, testSchema, {
      tags: ["patchTag"],
    })
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/test",
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foo: "bar" }),
        next: { tags: ["patchTag"] },
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
    const errorResponse = { error: "Internal server error occurred" }
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(errorResponse), {
        status: 500,
        statusText: "Internal Server Error",
      }),
    )
    const result = await client.patch("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Internal server error occurred")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("PATCH")
        expect(result.error.url).toBe("https://api.example.com/test")
        expect(result.error.status).toBe(500)
      }
    }
  })

  it("should return error when schema validation fails", async () => {
    const testSchema = z.object({
      message: z.string(),
      patched: z.boolean(),
    })
    const invalidResponse = { message: "patched" } // missing patched field
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
    const result = await client.patch("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Invalid response format")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("PATCH")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
    }
  })

  it("should handle network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const result = await client.patch("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Network error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("PATCH")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
      expect(result.status).toBe(null)
    }
  })

  it("should handle non-Error network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce("String error")

    const result = await client.patch("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Network error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("PATCH")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
      expect(result.status).toBe(null)
    }
  })
})
