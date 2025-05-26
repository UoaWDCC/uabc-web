import { GET } from "./route"

describe("globals/footer", () => {
  describe("GET", () => {
    it("should return a global footer", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
          title: "UABC",
          description: "The largest university badminton club in New Zealand!",
          facebook: "https://www.facebook.com/groups/uoabadminton/",
          instagram: "https://www.instagram.com/uoa.badminton/",
          linkGroup1: {
            title: "Quick Links",
            links: [],
          },
          linkGroup2: {
            title: "UABC",
            links: [],
          },
          copyright: "© 2025 University of Auckland Badminton Club. \nAll rights reserved.",
          credits: "Developed by the 2025 WDCC UABC Team.",
        },
      })
    })
  })
})
