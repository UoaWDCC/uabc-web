import { GET } from "./route"

describe("globals/navbar", () => {
  describe("GET", () => {
    it("should return a global navbar", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
          navItems: [],
          signInButton: {
            label: "Sign in",
            url: "/auth/sign-in",
          },
        },
      })
    })
  })
})
