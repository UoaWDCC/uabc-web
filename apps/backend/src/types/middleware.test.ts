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

  it("should reject a JWT response with missing access_token", () => {
    const invalid = {
      user: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "member",
        updatedAt: "2023-01-01",
        createdAt: "2023-01-01",
      },
      // access_token is missing
    }
    expect(() => JWTResponseSchema.parse(invalid)).toThrow()
  })

  it("should reject a JWT response with missing user", () => {
    const invalid = {
      // user is missing
      access_token: "token123",
    }
    expect(() => JWTResponseSchema.parse(invalid)).toThrow()
  })

  it("should reject a JWT response with malformed user", () => {
    const invalid = {
      user: {
        id: "1",
        // firstName is missing
        lastName: "Doe",
        email: "john@example.com",
        role: "member",
        updatedAt: "2023-01-01",
        createdAt: "2023-01-01",
      },
      access_token: "token123",
    }
    expect(() => JWTResponseSchema.parse(invalid)).toThrow()
  })
})
