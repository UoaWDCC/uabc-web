import { getImageUrl } from "./UserPanelUtils"

describe("getImageUrl", () => {
  it("returns the image url", () => {
    expect(getImageUrl("https://example.com/image.jpg")).toBe("https://example.com/image.jpg")
    expect(getImageUrl(null)).toBeUndefined()
    expect(getImageUrl(undefined)).toBeUndefined()
    expect(
      getImageUrl({
        id: "1",
        alt: "Image",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        url: "https://example.com/image.jpg",
      }),
    ).toBe("https://example.com/image.jpg")

    expect(
      getImageUrl({
        id: "1",
        alt: "Image",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        url: null,
      }),
    ).toBeUndefined()
  })
})
