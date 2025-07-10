import { adminUserMock, casualUserMock, memberUserMock } from "@repo/shared/mocks"

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
