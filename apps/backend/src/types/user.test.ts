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
})
