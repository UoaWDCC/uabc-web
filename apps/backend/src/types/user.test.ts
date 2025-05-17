import { MembershipType } from "./types"
import { UserSchema } from "./user"

describe("UserSchema", () => {
  it("should validate a valid user", () => {
    const valid = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: MembershipType.member,
      updatedAt: "2023-01-01",
      createdAt: "2023-01-01",
    }
    expect(UserSchema.parse(valid)).toBeDefined()
  })

  it("should reject a user with missing required fields", () => {
    const invalid = {
      id: "1",
      firstName: "John",
      // lastName is missing
      email: "john@example.com",
      role: MembershipType.member,
      updatedAt: "2023-01-01",
      createdAt: "2023-01-01",
    }
    expect(() => UserSchema.parse(invalid)).toThrow()
  })

  it("should reject a user with an invalid email", () => {
    const invalid = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "not-an-email",
      role: MembershipType.member,
      updatedAt: "2023-01-01",
      createdAt: "2023-01-01",
    }
    expect(() => UserSchema.parse(invalid)).toThrow()
  })

  it("should reject a user with an invalid role", () => {
    const invalid = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "invalid-role",
      updatedAt: "2023-01-01",
      createdAt: "2023-01-01",
    }
    expect(() => UserSchema.parse(invalid)).toThrow()
  })
})
