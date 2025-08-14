import { GET } from "./route"

describe("globals/location-bubble", () => {
  describe("GET", () => {
    it("should return a global LocationBubble", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
          locationBubbleItems: [],
        },
      })
    })
  })
})
