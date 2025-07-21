import { GET } from "./route"

describe("globals/navbar", () => {
  describe("GET", () => {
    it("should return a global navbar", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
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
          navItems: [
            {
              id: expect.any(String),
              label: "Book",
              url: "/book",
            },
            {
              id: expect.any(String),
              label: "Events",
              url: "/events",
            },
            {
              id: expect.any(String),
              label: "About",
              url: "/about",
            },
            {
              id: expect.any(String),
              label: "Contact",
              url: "/contact",
            },
            {
              id: expect.any(String),
              label: "FAQ",
              url: "/faq",
            },
          ],
          rightSideSingleButton: {
            label: "Log in",
            url: "/auth/login",
          },
        },
      })
    })
  })
})
