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
              link: {
                label: "Book",
                url: "/book",
              },
            },
            {
              id: expect.any(String),
              link: {
                label: "Events",
                url: "/events",
              },
            },
            {
              id: expect.any(String),
              link: {
                label: "About",
                url: "/about",
              },
            },
            {
              id: expect.any(String),
              link: {
                label: "Contact",
                url: "/contact",
              },
            },
            {
              id: expect.any(String),
              link: {
                label: "FAQ",
                url: "/faq",
              },
            },
          ],
          rightSideSingleButton: {
            label: "Sign in",
            url: "/auth/sign-in",
          },
        },
      })
    })
  })
})
