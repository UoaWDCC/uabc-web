import { GET } from "./route"

describe("globals/tos", () => {
  describe("GET", () => {
    it("should return a global TOS", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
          title: "Terms of Service",
          subtitle: "Want to play? Read here!",
          checkInRules: {
            title: "Check-In Rules",
            rules: {
              root: {
                type: "root",
                children: [],
              },
            },
          },
          sessionRules: {
            title: "At a session? Follow these!",
            rules: {
              root: {
                type: "root",
                children: [],
              },
            },
          },
          disclaimer: {
            title: "Disclaimer",
            disclaimer: {
              root: {
                type: "root",
                children: [],
              },
            },
          },
          updatedAt: null,
          createdAt: null,
        },
      })
    })
  })
})
