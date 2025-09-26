import type { User } from "@repo/shared/payload-types"
import { type CreateUserData, Gender, MembershipType, PlayLevel } from "../types"

export const CASUAL_USER_UID = "000000000000000000000001"
export const MEMBER_USER_UID = "000000000000000000000002"
export const ADMIN_USER_UID = "000000000000000000000003"

export const VERIFICATION_CODE_MOCK = "mock-code"

const validEmailVerification = {
  verificationCode: VERIFICATION_CODE_MOCK,
  expiresAt: new Date(1970, 1, 1).toISOString(), // irrelevant time
  createdAt: new Date(1970, 1, 1).toISOString(), //irrelevant time
}

export const casualUserMock: User = {
  id: CASUAL_USER_UID,
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@casual.com",
  emailVerification: validEmailVerification,
  gender: Gender.nonBinary,
  role: MembershipType.casual,
  remainingSessions: 4,
  playLevel: PlayLevel.beginner,
  dietaryRequirements: "Peanut",
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const memberUserMock: User = {
  id: MEMBER_USER_UID,
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@member.com",
  emailVerification: validEmailVerification,
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
  emailVerification: validEmailVerification,
  role: MembershipType.admin,
  remainingSessions: 6,
  updatedAt: new Date(2025, 0, 1).toISOString(),
  createdAt: new Date(2025, 0, 1).toISOString(),
}

export const userCreateMock: CreateUserData = {
  firstName: "straight",
  lastName: "zhao",
  email: "straight.zhao@example.com",
  role: MembershipType.casual,
  remainingSessions: 7,
  image: null,
  emailVerification: validEmailVerification,
}

export const memberUserCreateMock: CreateUserData = {
  firstName: "straight",
  lastName: "zhao",
  email: "unstraight.zhao@example.com",
  role: MembershipType.member,
  remainingSessions: 7,
  image: null,
  emailVerification: validEmailVerification,
}
