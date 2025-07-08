import { GET } from "./route"

describe("api/health", () => {
  describe("GET", () => {
    it("should return status healthy", async () => {
      const response = await GET()
      expect(response.status).toBe(200)
      const json = await response.json()
      expect(json).toEqual({ status: "healthy" })
    })
  })
})
