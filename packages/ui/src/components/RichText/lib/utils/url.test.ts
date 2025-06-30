import { resolveUrl } from "./url"

describe("resolveUrl", () => {
  const baseUrl = "https://api.example.com"

  it("should return the original URL if no base URL is provided", () => {
    expect(resolveUrl("/image.jpg")).toBe("/image.jpg")
  })

  it("should return the original URL if it is already absolute (https)", () => {
    expect(resolveUrl("https://cdn.example.com/image.jpg", baseUrl)).toBe(
      "https://cdn.example.com/image.jpg",
    )
  })

  it("should return the original URL if it is already absolute (http)", () => {
    expect(resolveUrl("http://cdn.example.com/image.jpg", baseUrl)).toBe(
      "http://cdn.example.com/image.jpg",
    )
  })

  it("should return the original URL if it is protocol-relative", () => {
    expect(resolveUrl("//cdn.example.com/image.jpg", baseUrl)).toBe("//cdn.example.com/image.jpg")
  })

  it("should resolve a relative URL with a base URL", () => {
    expect(resolveUrl("/image.jpg", baseUrl)).toBe("https://api.example.com/image.jpg")
  })

  it("should resolve a relative URL without a leading slash", () => {
    expect(resolveUrl("image.jpg", baseUrl)).toBe("https://api.example.com/image.jpg")
  })

  it("should handle a base URL with a trailing slash", () => {
    expect(resolveUrl("/image.jpg", `${baseUrl}/`)).toBe("https://api.example.com/image.jpg")
  })

  it("should handle a relative URL without a leading slash and a base URL with a trailing slash", () => {
    expect(resolveUrl("image.jpg", `${baseUrl}/`)).toBe("https://api.example.com/image.jpg")
  })
})
