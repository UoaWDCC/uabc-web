import { StatusCodes } from "http-status-codes"
import { z } from "zod"
import { ApiClient, createApiClient } from "./client"

// Mock fetch globally
global.fetch = vi.fn()

const mockFetch = vi.mocked(fetch)

describe("ApiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

  describe("constructor", () => {
    it("should initialize with NEXT_PUBLIC_API_URL from environment", () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")

      expect(createApiClient()).toBeInstanceOf(Object.getPrototypeOf(createApiClient()).constructor)
    })

    it("should throw error when NEXT_PUBLIC_API_URL is empty string", () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "")

      expect(() => createApiClient()).toThrow(
        "API URL is not defined. Please provide it in the constructor or set NEXT_PUBLIC_API_URL environment variable.",
      )
    })

    it("should throw error when NEXT_PUBLIC_API_URL is not defined", () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", undefined)

      expect(() => createApiClient()).toThrow(
        "API URL is not defined. Please provide it in the constructor or set NEXT_PUBLIC_API_URL environment variable.",
      )
    })
  })

  describe("URL joining", () => {
    let client: ReturnType<typeof createApiClient>
    const testSchema = z.object({ message: z.string() })
    const mockResponse = { message: "success" }

    beforeEach(() => {
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

      // Test all methods with the same URL joining scenario
      await client.get("/test", testSchema)
      await client.post("/test", {}, testSchema)
      await client.put("/test", {}, testSchema)
      await client.patch("/test", {}, testSchema)
      await client.delete("/test", testSchema)

      // All should result in the same properly joined URL
      expect(mockFetch).toHaveBeenCalledTimes(5)
      mockFetch.mock.calls.forEach((call) => {
        expect(call[0]).toBe("https://api.example.com/test")
      })
    })
  })

  describe("get method", () => {
    let client: ReturnType<typeof createApiClient>

    beforeEach(() => {
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

      mockFetch.mockResolvedValueOnce(new Response(null, { status: 404, statusText: "Not Found" }))

      const result = await client.get("/test", testSchema)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("HTTP 404: Not Found")
        expect(result.status).toBe(404)
      }
    })

    it("should return error when schema validation fails", async () => {
      const testSchema = z.object({
        message: z.string(),
        requiredField: z.string(),
      })

      const invalidResponse = { message: "success" } // missing requiredField

      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))

      const result = await client.get("/test", testSchema)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("Invalid response format")
      }
    })

    it("should handle network errors", async () => {
      const testSchema = z.object({ message: z.string() })

      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      const result = await client.get("/test", testSchema)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("Network error")
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
  })

  describe("post method", () => {
    let client: ReturnType<typeof createApiClient>
    beforeEach(() => {
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
      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 400, statusText: "Bad Request" }),
      )
      const result = await client.post("/test", { foo: "bar" }, testSchema)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("HTTP 400: Bad Request")
      }
    })

    it("should return error when schema validation fails", async () => {
      const testSchema = z.object({ message: z.string(), id: z.number() })
      const invalidResponse = { message: "created" } // missing id
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
      const result = await client.post("/test", { foo: "bar" }, testSchema)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("Invalid response format")
      }
    })
  })

  describe("put method", () => {
    let client: ReturnType<typeof createApiClient>
    beforeEach(() => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()
    })

    it("should successfully put and parse data", async () => {
      const testSchema = z.object({
        message: z.string(),
        updated: z.boolean(),
      })
      const mockResponse = { message: "updated", updated: true }
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
      const result = await client.put("/test", { foo: "bar" }, testSchema, {
        tags: ["putTag"],
      })
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foo: "bar" }),
          next: { tags: ["putTag"] },
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
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 404, statusText: "Not Found" }))
      const result = await client.put("/test", { foo: "bar" }, testSchema)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("HTTP 404: Not Found")
      }
    })

    it("should return error when schema validation fails", async () => {
      const testSchema = z.object({
        message: z.string(),
        updated: z.boolean(),
      })
      const invalidResponse = { message: "updated" } // missing updated field
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
      const result = await client.put("/test", { foo: "bar" }, testSchema)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("Invalid response format")
      }
    })
  })

  describe("patch method", () => {
    let client: ReturnType<typeof createApiClient>
    beforeEach(() => {
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
  })

  describe("delete method", () => {
    let client: ReturnType<typeof createApiClient>
    beforeEach(() => {
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

    it("should return error when response is not ok", async () => {
      const testSchema = z.object({ message: z.string() })
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 403, statusText: "Forbidden" }))
      const result = await client.delete("/test", testSchema)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("HTTP 403: Forbidden")
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
        expect(result.error).toBeInstanceOf(Error)
        expect(result.error.message).toBe("Invalid response format")
      }
    })
  })

  describe("helper methods", () => {
    it("should throw error when using throwIfError with failed response", () => {
      const failedResponse = {
        success: false as const,
        error: new Error("Test error"),
        status: 400,
      }

      expect(() => ApiClient.throwIfError(failedResponse)).toThrow("Test error")
    })

    it("should return data when using throwIfError with successful response", () => {
      const successfulResponse = {
        success: true as const,
        data: { message: "success" },
        status: 200,
      }

      const result = ApiClient.throwIfError(successfulResponse)
      expect(result).toEqual({ message: "success" })
    })

    it("should return null when using returnNullIfError with failed response", () => {
      const failedResponse = {
        success: false as const,
        error: new Error("Test error"),
        status: 400,
      }

      const result = ApiClient.returnNullIfError(failedResponse)
      expect(result).toBe(null)
    })

    it("should return data when using returnNullIfError with successful response", () => {
      const successfulResponse = {
        success: true as const,
        data: { message: "success" },
        status: 200,
      }

      const result = ApiClient.returnNullIfError(successfulResponse)
      expect(result).toEqual({ message: "success" })
    })
  })
})
