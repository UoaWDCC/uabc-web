import { z } from "zod"
import { ApiClient } from "./client"

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

      const client = new ApiClient()
      expect(client).toBeInstanceOf(ApiClient)
    })

    it("should throw error when NEXT_PUBLIC_API_URL is not defined", () => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "")

      expect(() => new ApiClient()).toThrow("NEXT_PUBLIC_API_URL is not defined")
    })
  })

  describe("get method", () => {
    let client: ApiClient

    beforeEach(() => {
      vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com")
      client = new ApiClient()
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
      expect(result).toEqual(mockResponse)
    })

    it("should handle fetch with default empty tags", async () => {
      const testSchema = z.object({ message: z.string() })
      const mockResponse = { message: "success" }

      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(mockResponse)))

      await client.get("/test", testSchema)

      expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/test", {
        next: {
          tags: [],
        },
      })
    })

    it("should throw error when response is not ok", async () => {
      const testSchema = z.object({ message: z.string() })

      mockFetch.mockResolvedValueOnce(new Response(null, { status: 404, statusText: "Not Found" }))

      await expect(client.get("/test", testSchema)).rejects.toThrow(
        "Failed to fetch /test: Not Found",
      )
    })

    it("should throw error when schema validation fails", async () => {
      const testSchema = z.object({
        message: z.string(),
        requiredField: z.string(),
      })

      const invalidResponse = { message: "success" } // missing requiredField

      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(invalidResponse)))

      await expect(client.get("/test", testSchema)).rejects.toThrow()
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

      expect(result).toEqual(mockResponse)
    })
  })
})
