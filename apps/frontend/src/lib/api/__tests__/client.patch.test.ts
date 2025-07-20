import { StatusCodes } from "http-status-codes"
import { z } from "zod"
import { createApiClient } from "../client"

// Mock fetch globally
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
    mockFetch.mockResolvedValueOnce(
      new Response(null, { status: 500, statusText: "Internal Server Error" }),
    )
    const result = await client.patch("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error.message).toBe("HTTP 500: Internal Server Error")
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
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error.message).toBe("Invalid response format")
    }
  })

  it("should handle network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce(new Error("Network error"))

    const result = await client.patch("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error.message).toBe("Network error")
      expect(result.status).toBe(null)
    }
  })

  it("should handle non-Error network errors", async () => {
    const testSchema = z.object({ message: z.string() })

    mockFetch.mockRejectedValueOnce("String error")

    const result = await client.patch("/test", { foo: "bar" }, testSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error.message).toBe("Network error")
      expect(result.status).toBe(null)
    }
  })
})
