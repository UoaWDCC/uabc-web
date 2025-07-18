import { GET } from "./route"

describe("globals/tos", () => {
  describe("GET", () => {
    it("should return a global TOS", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
          title: "Terms of Service",
          codeOfConduct: {
            title: "Code of Conduct",
            subtitle: "Want to play? Read here!",
            checkInRules: {
              title: "Check-In Rules",
              rules: [],
            },
            sessionRules: {
              title: "At a session? Follow these!",
              rules: [],
            },
            disclaimer: {
              title: "Disclaimer",
              items: [
                {
                  item: "UABC does not accept liability for any injuries or lost property. Members understand the potential risks of attending sessions and are liable for all consequences.",
                },
              ],
            },
          },
        },
      })
    })
  })
})
