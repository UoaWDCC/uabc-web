import { StatusCodes } from "http-status-codes"
import { z } from "zod"
import { ApiClientError, createApiClient } from "../client"

global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe("ApiClient DELETE method", () => {
  let client: ReturnType<typeof createApiClient>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
    client = createApiClient()
  })

  it("should successfully delete and parse data", async () => {
    const testSchema = z.object({
      message: z.string(),
      deleted: z.boolean(),
    })
    const mockResponse = { message: "deleted", deleted: true }
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
    const result = await client.delete("/test", testSchema, {
      tags: ["deleteTag"],
    })
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/test",
      expect.objectContaining({
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        next: { tags: ["deleteTag"] },
      }),
    )
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      status: StatusCodes.OK,
    })
  })

  it("should handle 204 No Content response", async () => {
    mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }))
    const result = await client.delete("/test")
    expect(result).toEqual({
      success: true,
      data: undefined,
      status: 204,
    })
  })

  it("should handle response with content-length 0", async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(null, {
        status: 200,
        headers: { "content-length": "0" },
      }),
    )
    const result = await client.delete("/test")
    expect(result).toEqual({
      success: true,
      data: undefined,
      status: 200,
    })
  })

  it("should handle response with schema validation", async () => {
    const testSchema = z.object({ message: z.string() })
    const mockResponse = { message: "deleted" }
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
    const result = await client.delete("/test", testSchema)
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      status: StatusCodes.OK,
    })
  })

  it("should handle response without schema - successful JSON parsing", async () => {
    const mockResponse = { message: "deleted" }
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
    const result = await client.delete("/test")
    expect(result).toEqual({
      success: true,
      data: mockResponse,
      status: StatusCodes.OK,
    })
  })

  it("should handle response without schema - failed JSON parsing", async () => {
    mockFetch.mockResolvedValueOnce(new Response("invalid json", { status: 200 }))
    const result = await client.delete("/test")
    expect(result).toEqual({
      success: true,
      data: undefined,
      status: StatusCodes.OK,
    })
  })

  it("should return error when response is not ok", async () => {
    const testSchema = z.object({ message: z.string() })
    const errorResponse = { error: "Access forbidden" }
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(errorResponse), { status: 403, statusText: "Forbidden" }),
    )
    const result = await client.delete("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Access forbidden")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("DELETE")
        expect(result.error.url).toBe("https://api.example.com/test")
        expect(result.error.status).toBe(403)
      }
    }
  })

  it("should return error when schema validation fails", async () => {
    const testSchema = z.object({
      message: z.string(),
      deleted: z.boolean(),
    })
    const invalidResponse = { message: "deleted" } // missing deleted field
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
    const result = await client.delete("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Invalid response format")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("DELETE")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
    }
  })

  it("should handle network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const result = await client.delete("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Network error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("DELETE")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
      expect(result.status).toBe(null)
    }
  })

  it("should handle non-Error network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce("String error")

    const result = await client.delete("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("Network error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("DELETE")
        expect(result.error.url).toBe("https://api.example.com/test")
      }
      expect(result.status).toBe(null)
    }
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

    const result = await client.delete("/test", testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(ApiClientError)
      expect(result.error.message).toBe("HTTP 500: Internal Server Error")
      if (result.error instanceof ApiClientError) {
        expect(result.error.method).toBe("DELETE")
        expect(result.error.url).toBe("https://api.example.com/test")
        expect(result.error.status).toBe(500)
      }
      expect(result.status).toBe(500)
    }
  })
})
