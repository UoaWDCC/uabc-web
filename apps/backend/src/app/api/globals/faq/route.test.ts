import { GET } from "./route"

describe("globals/faq", () => {
  describe("GET", () => {
    it("should return a global FAQ", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
          title: "FAQs",
          questions: [],
        },
      })
    })
  })
})
