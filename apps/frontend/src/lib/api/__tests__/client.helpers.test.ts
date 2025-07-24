import { ApiClient, ApiClientError } from "../client"

describe("ApiClient helper methods", () => {
  it("should throw error when using throwIfError with failed response", () => {
    const failedResponse = {
      success: false as const,
      error: new ApiClientError({
        message: "Test error",
        method: "GET",
        url: "https://api.example.com/test",
      }),
      status: 400,
    }

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => ApiClient.throwIfError(failedResponse)).toThrow("Test error")
    expect(errorSpy).toHaveBeenCalledWith(failedResponse.error)
    errorSpy.mockRestore()
    try {
      ApiClient.throwIfError(failedResponse)
    } catch (err) {
      expect(err).toBeInstanceOf(ApiClientError)
      if (err instanceof ApiClientError) {
        expect(err.method).toBe("GET")
        expect(err.url).toBe("https://api.example.com/test")
      }
    }
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
