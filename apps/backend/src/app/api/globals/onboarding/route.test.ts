import { GET } from "./route"

describe("globals/onboarding", () => {
  describe("GET", () => {
    it("should return a global onboarding", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {},
      })
    })
  })
})
