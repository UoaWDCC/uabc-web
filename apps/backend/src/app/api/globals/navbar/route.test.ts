import { GET } from "./route"

describe("globals/navbar", () => {
  describe("GET", () => {
    it("should return a global navbar", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
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
