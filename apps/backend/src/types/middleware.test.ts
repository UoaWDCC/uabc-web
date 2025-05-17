import { JWTResponseSchema } from "./middleware"

describe("JWTResponseSchema", () => {
  it("should validate a valid JWT response", () => {
    const valid = {
      user: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "member",
        updatedAt: "2023-01-01",
        createdAt: "2023-01-01",
      },
      access_token: "token123",
    }
    expect(JWTResponseSchema.parse(valid)).toBeDefined()
  })
})
