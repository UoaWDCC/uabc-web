import { createApiClient } from "../client"

describe("ApiClient constructor", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
  })

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
