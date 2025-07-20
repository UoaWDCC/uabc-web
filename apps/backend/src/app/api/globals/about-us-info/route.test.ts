import { GET } from "./route"

describe("globals/about-us-info", () => {
  describe("GET", () => {
    it("should return a global AboutUsInfo", async () => {
      const response = await GET()
      const json = await response.json()

      expect(json).toStrictEqual({
        data: {
          items: [
            {
              title: "Who We Are",
              description:
                "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
              id: expect.any(String),
            },
            {
              title: "What We Do",
              description:
                "We run weekly badminton sessions at 3 different locations for casual members and paid members. We also run social events and other competitions spread across the semesters!",
              id: expect.any(String),
            },
            {
              title: "Why Join",
              description:
                "We are a group of like-minded badminton people who love to play badminton and have fun! We also cater for all skill levels, so if you are new, this is the perfect place to start!",
              id: expect.any(String),
            },
          ],
        },
      })
    })
  })
})
