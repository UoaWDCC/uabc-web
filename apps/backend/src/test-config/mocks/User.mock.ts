import { type CreateUserData, MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"

export const CASUAL_USER_UID = "000000000000000000000001"
export const MEMBER_USER_UID = "000000000000000000000002"
export const ADMIN_USER_UID = "000000000000000000000003"

// NOTE: these mocks are here and not in User.mock.ts because they result in circular dependencies for the UID mocks
export const casualUserMock: User = {
  id: CASUAL_USER_UID,
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@casual.com",
  role: MembershipType.casual,
  remainingSessions: 5,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const memberUserMock: User = {
  id: MEMBER_USER_UID,
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@member.com",
  role: MembershipType.member,
  remainingSessions: 5,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const adminUserMock: User = {
  id: ADMIN_USER_UID,
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@admin.com",
  role: MembershipType.admin,
  remainingSessions: 5,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const userCreateMock: CreateUserData = {
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@example.com",
  role: "casual",
  remainingSessions: 5,
  image: null,
}
