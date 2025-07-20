import { ApiClient } from "../client"

describe("ApiClient helper methods", () => {
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
