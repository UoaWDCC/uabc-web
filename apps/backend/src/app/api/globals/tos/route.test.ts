import { GET } from "./route"

describe("globals/tos", () => {
  describe("GET", () => {
    it("should return a global TOS", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
          checkInRules: {
            title: "Check-In Rules",
          },
          disclaimer: {
            title: "Disclaimer",
          },
          sessionRules: {
            title: "At a session? Follow these!",
          },
          subtitle: "Want to play? Read here!",
          title: "Terms of Service",
        },
      })
    })
  })
})
