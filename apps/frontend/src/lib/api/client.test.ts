import { z } from "zod"
import { createApiClient } from "./client"

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

      const result = await client.get("/test", testSchema, ["tag1", "tag2"])

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
        next: {
          tags: ["tag1", "tag2"],
        },
      })
      expect(result).toEqual({ data: mockResponse, isError: false })
    })

    it("should handle fetch with default empty tags", async () => {
      const testSchema = z.object({ message: z.string() })
      const mockResponse = { message: "success" }

      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

      const result = await client.get("/test", testSchema)

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
        next: {
          tags: [],
        },
      })
      expect(result).toEqual({ data: mockResponse, isError: false })
    })

    it("should return error when response is not ok", async () => {
      const testSchema = z.object({ message: z.string() })

      mockFetch.mockResolvedValueOnce(new Response(null, { status: 404, statusText: "Not Found" }))

      const result = await client.get("/test", testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error?.message).toBe("Failed to fetch /test: Not Found")
    })

    it("should return error when schema validation fails", async () => {
      const testSchema = z.object({
        message: z.string(),
        requiredField: z.string(),
      })

      const invalidResponse = { message: "success" } // missing requiredField

      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))

      const result = await client.get("/test", testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
    })

    it("should handle different response types with complex schemas", async () => {
      const complexSchema = z.object({
        id: z.number(),
        name: z.string(),
        tags: z.array(z.string()),
        metadata: z.object({
          created: z.string(),
          updated: z.string(),
        }),
      })

      const mockResponse = {
        id: 1,
        name: "Test Item",
        tags: ["test", "item"],
        metadata: {
          created: "2023-01-01",
          updated: "2023-01-02",
        },
      }

      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

      const result = await client.get("/complex", complexSchema, ["complex"])

      expect(result).toEqual({ data: mockResponse, isError: false })
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
      const result = await client.post("/test", { foo: "bar" }, testSchema, ["postTag"])
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foo: "bar" }),
          next: { tags: ["postTag"] },
        }),
      )
      expect(result).toEqual({ data: mockResponse, isError: false })
    })
    it("should return error when response is not ok", async () => {
      const testSchema = z.object({ message: z.string() })
      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 400, statusText: "Bad Request" }),
      )
      const result = await client.post("/test", { foo: "bar" }, testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error?.message).toBe("Failed to fetch /test: Bad Request")
    })
    it("should return error when schema validation fails", async () => {
      const testSchema = z.object({ message: z.string(), id: z.number() })
      const invalidResponse = { message: "created" }
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
      const result = await client.post("/test", { foo: "bar" }, testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
    })
  })

  describe("put method", () => {
    let client: ReturnType<typeof createApiClient>
    beforeEach(() => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()
    })
    it("should successfully put and parse data", async () => {
      const testSchema = z.object({ message: z.string(), updated: z.boolean() })
      const mockResponse = { message: "updated", updated: true }
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
      const result = await client.put("/test", { foo: "bar" }, testSchema, ["putTag"])
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foo: "bar" }),
          next: { tags: ["putTag"] },
        }),
      )
      expect(result).toEqual({ data: mockResponse, isError: false })
    })
    it("should return error when response is not ok", async () => {
      const testSchema = z.object({ message: z.string() })
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 404, statusText: "Not Found" }))
      const result = await client.put("/test", { foo: "bar" }, testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error?.message).toBe("Failed to fetch /test: Not Found")
    })
    it("should return error when schema validation fails", async () => {
      const testSchema = z.object({ message: z.string(), updated: z.boolean() })
      const invalidResponse = { message: "updated" }
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
      const result = await client.put("/test", { foo: "bar" }, testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
    })
  })

  describe("patch method", () => {
    let client: ReturnType<typeof createApiClient>
    beforeEach(() => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()
    })
    it("should successfully patch and parse data", async () => {
      const testSchema = z.object({ message: z.string(), patched: z.boolean() })
      const mockResponse = { message: "patched", patched: true }
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
      const result = await client.patch("/test", { foo: "bar" }, testSchema, ["patchTag"])
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foo: "bar" }),
          next: { tags: ["patchTag"] },
        }),
      )
      expect(result).toEqual({ data: mockResponse, isError: false })
    })
    it("should return error when response is not ok", async () => {
      const testSchema = z.object({ message: z.string() })
      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 500, statusText: "Internal Server Error" }),
      )
      const result = await client.patch("/test", { foo: "bar" }, testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error?.message).toBe("Failed to fetch /test: Internal Server Error")
    })
    it("should return error when schema validation fails", async () => {
      const testSchema = z.object({ message: z.string(), patched: z.boolean() })
      const invalidResponse = { message: "patched" }
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
      const result = await client.patch("/test", { foo: "bar" }, testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
    })
  })

  describe("delete method", () => {
    let client: ReturnType<typeof createApiClient>
    beforeEach(() => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = createApiClient()
    })
    it("should successfully delete and parse data", async () => {
      const testSchema = z.object({ message: z.string(), deleted: z.boolean() })
      const mockResponse = { message: "deleted", deleted: true }
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))
      const result = await client.delete("/test", testSchema, ["deleteTag"])
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        expect.objectContaining({
          method: "DELETE",
          next: { tags: ["deleteTag"] },
        }),
      )
      expect(result).toEqual({ data: mockResponse, isError: false })
    })
    it("should return error when response is not ok", async () => {
      const testSchema = z.object({ message: z.string() })
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 403, statusText: "Forbidden" }))
      const result = await client.delete("/test", testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error?.message).toBe("Failed to fetch /test: Forbidden")
    })
    it("should return error when schema validation fails", async () => {
      const testSchema = z.object({ message: z.string(), deleted: z.boolean() })
      const invalidResponse = { message: "deleted" }
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))
      const result = await client.delete("/test", testSchema)
      expect(result.isError).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
    })
  })
})
