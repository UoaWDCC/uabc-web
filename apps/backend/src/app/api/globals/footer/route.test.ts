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
          linktree: "linktr.ee/uoa.badminton",
          facebook: "https://www.facebook.com/groups/uoabadminton/",
          instagram: "https://www.instagram.com/uoa.badminton/",
          logo: {
            alt: "Logo",
            filename: "Logo.png",
            url: "/payload/api/media/file/Logo.png",
            updatedAt: new Date(2025, 0, 1).toISOString(),
            createdAt: new Date(2025, 0, 1).toISOString(),
            width: 55,
            height: 54,
            focalX: 50,
            focalY: 50,
            id: "ccaf8f75ceb9f059773d4774",
          },
          linkGroup1: {
            title: "Quick Links",
            links: [
              {
                id: expect.any(String),
                label: "Home",
                url: "/",
              },
              {
                id: expect.any(String),
                label: "Book a Court",
                url: "/book",
              },
              {
                id: expect.any(String),
                label: "Events",
                url: "/events",
              },
            ],
          },
          linkGroup2: {
            title: "UABC",
            links: [
              {
                id: expect.any(String),
                label: "About Us",
                url: "/about",
              },
              {
                id: expect.any(String),
                label: "Contact Us",
                url: "/contact",
              },
              {
                id: expect.any(String),
                label: "FAQs",
                url: "/faq",
              },
            ],
          },
          copyright: "© 2025 University of Auckland Badminton Club",
        },
      })
    })
  })
})
