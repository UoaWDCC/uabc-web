import { adminUserMock, casualUserMock, memberUserMock } from "@repo/shared/mocks"

const navItemsMock = [
  { id: "1", link: { label: "Book", url: "/book" } },
  { id: "2", link: { label: "Events", url: "/events" } },
  { id: "3", link: { label: "About", url: "/about" } },
  { id: "4", link: { label: "Contact", url: "/contact" } },
  { id: "5", link: { label: "FAQ", url: "/faq" } },
]

const rightSideSingleButtonMock = {
  label: "Sign In",
  url: "/auth/signin",
}

const logoMock = {
  id: "0",
  src: "/images/logo.png",
  alt: "UABC Logo",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const NAVIGATION_BAR_NO_USER_TEST_CONSTANTS = {
  id: "0123456789",
  navItems: navItemsMock,
  rightSideSingleButton: rightSideSingleButtonMock,
  logo: logoMock,
}

export const NAVIGATION_BAR_CASUAL_TEST_CONSTANTS = {
  ...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS,
  user: casualUserMock,
}

export const NAVIGATION_BAR_MEMBER_TEST_CONSTANTS = {
  ...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS,
  user: memberUserMock,
}

export const NAVIGATION_BAR_ADMIN_TEST_CONSTANTS = {
  ...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS,
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
