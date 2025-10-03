/** biome-ignore-all lint/suspicious/noExplicitAny: used to mock the payload hook in tests */
import { MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import { validateUserRemainingSessions } from "./user-remaining-sessions"

describe("validateUserRemainingSessions", () => {
  it("should set role to 'member' if not admin and remainingSessions > 0", () => {
    const data: Partial<User> = {
      role: MembershipType.casual,
      remainingSessions: 5,
    }
    const result = validateUserRemainingSessions({ data } as any)
    expect(result.role).toBe(MembershipType.member)
  })

  it("should set role to 'casual' if not admin and remainingSessions <= 0", () => {
    const data: Partial<User> = {
      role: MembershipType.member,
      remainingSessions: 0,
    }
    const result = validateUserRemainingSessions({ data } as any)
    expect(result.role).toBe(MembershipType.casual)
  })

  it("should set role to 'casual' if not admin and remainingSessions is undefined", () => {
    const data: Partial<User> = {
      role: MembershipType.member,
      remainingSessions: undefined,
    }
    const result = validateUserRemainingSessions({ data } as any)
    expect(result.role).toBe(MembershipType.casual)
  })

  it("should not change role if user is admin", () => {
    const data: Partial<User> = {
      role: MembershipType.admin,
      remainingSessions: 0,
    }
    const result = validateUserRemainingSessions({ data } as any)
    expect(result.role).toBe(MembershipType.admin)
  })

  it("should set role to 'casual' if not admin and remainingSessions is negative", () => {
    const data: Partial<User> = {
      role: MembershipType.member,
      remainingSessions: -3,
    }
    const result = validateUserRemainingSessions({ data } as any)
    expect(result.role).toBe(MembershipType.casual)
  })
})
