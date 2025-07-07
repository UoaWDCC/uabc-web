// import { adminUserMock, casualUserMock, memberUserMock } from "@backend/test-config/mocks/User.mock"
import { MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"

const CASUAL_USER_UID = "000000000000000000000001"
const MEMBER_USER_UID = "000000000000000000000002"
const ADMIN_USER_UID = "000000000000000000000003"

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

const navItemsMock = [
  { label: "Book", path: "/book" },
  { label: "Profile", path: "/profile" },
  { label: "Events", path: "/events" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
]

export const NAVIGATION_BAR_NO_USER_TEST_CONSTANTS = {
  navItems: navItemsMock,
}

export const NAVIGATION_BAR_CASUAL_TEST_CONSTANTS = {
  navItems: navItemsMock,
  user: casualUserMock,
}

export const NAVIGATION_BAR_MEMBER_TEST_CONSTANTS = {
  navItems: navItemsMock,
  user: memberUserMock,
}

export const NAVIGATION_BAR_ADMIN_TEST_CONSTANTS = {
  navItems: navItemsMock,
  user: adminUserMock,
}

export const NAVIGATION_BAR_USER_MENU_TEST_CONSTANTS = {
  avatarProps: {
    name: casualUserMock.firstName,
    src:
      typeof casualUserMock.image === "string"
        ? casualUserMock.image
        : casualUserMock.image?.thumbnailURL || "",
  },
}
