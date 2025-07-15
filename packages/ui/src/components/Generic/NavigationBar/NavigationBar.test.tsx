vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    usePathname: vi.fn(),
  }
})

import * as NavigationBarModule from "@repo/ui/components/Generic/NavigationBar"
import {
  NAVIGATION_BAR_ADMIN_TEST_CONSTANTS,
  NAVIGATION_BAR_CASUAL_TEST_CONSTANTS,
  NAVIGATION_BAR_MEMBER_TEST_CONSTANTS,
  NAVIGATION_BAR_NO_USER_TEST_CONSTANTS,
  NAVIGATION_BAR_USER_MENU_TEST_CONSTANTS,
} from "@repo/ui/test-config/mocks/NavigationBar.mock"
import { render, screen, waitFor, waitForElementToBeRemoved } from "@repo/ui/test-utils"
import { usePathname } from "next/navigation"
import { isValidElement } from "react"
import { NavigationBar } from "./NavigationBar"
import { NavigationBarButton } from "./NavigationBarButton"
import { NavigationBarDesktop } from "./NavigationBarDesktop"
import { NavigationBarMobile } from "./NavigationBarMobile"

const mockUsePathname = vi.mocked(usePathname)

describe("<NavigationBar />", () => {
  it("should re-export the NavigationBar component and check if it exists", () => {
    expect(NavigationBarModule.NavigationBar).toBeDefined()
    expect(
      isValidElement(
        <NavigationBarModule.NavigationBar {...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS} />,
      ),
    ).toBeTruthy()
  })

  it("should render the NavigationBar with correct props", () => {
    render(<NavigationBar {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)
    expect(screen.getAllByText("Book")).toHaveLength(2)
    expect(screen.getAllByText("Events")).toHaveLength(2)
    expect(screen.getAllByText("About")).toHaveLength(2)
    expect(screen.getAllByText("Contact")).toHaveLength(2)
    expect(screen.getAllByText("FAQ")).toHaveLength(2)
  })
})

describe("<NavigationBarMobile />", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/book")
  })

  afterEach(() => {
    mockUsePathname.mockReset()
  })

  it("should re-export the NavigationBarMobile component and check if it exists", () => {
    expect(NavigationBarModule.NavigationBarMobile).toBeDefined()
    expect(
      isValidElement(
        <NavigationBarModule.NavigationBarMobile {...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS} />,
      ),
    ).toBeTruthy()
  })

  it("should render NavigationBarMobile with links hidden", () => {
    render(<NavigationBarMobile {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)
    expect(screen.getByText("Book")).not.toBeVisible()
    expect(screen.getByText("Events")).not.toBeVisible()
    expect(screen.getByText("About")).not.toBeVisible()
    expect(screen.getByText("Contact")).not.toBeVisible()
    expect(screen.getByText("FAQ")).not.toBeVisible()
  })

  it("should render NavigationBarMobile with links visible when menu is open", async () => {
    const { user } = render(<NavigationBarMobile {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)

    const menuButton = screen.getByRole("button")
    expect(menuButton).toBeInTheDocument()
    await user.click(menuButton)

    expect(screen.getByText("Book")).toBeInTheDocument()
    expect(screen.getByText("Events")).toBeInTheDocument()
    expect(screen.getByText("About")).toBeInTheDocument()
    expect(screen.getByText("Contact")).toBeInTheDocument()
    expect(screen.getByText("FAQ")).toBeInTheDocument()
  })

  it("should render a sign in button when user is not signed in", () => {
    render(<NavigationBarMobile {...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS} />)
    const signInButton = screen.getByText("Sign In")
    expect(signInButton).toBeInTheDocument()
    expect(signInButton).toHaveAttribute("href", "/auth/signin")
  })

  it("should render a profile link and sign out button when user is signed in as a casual", async () => {
    const { user } = render(<NavigationBarMobile {...NAVIGATION_BAR_CASUAL_TEST_CONSTANTS} />)

    const menuButton = screen.getByRole("button")
    expect(menuButton).toBeInTheDocument()
    await user.click(menuButton)

    const profileLink = screen.getByText("Profile")
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute("href", "/profile")

    const signOutLink = screen.getByText("Sign Out")
    expect(signOutLink).toBeInTheDocument()
    expect(signOutLink).toHaveAttribute("href", "/auth/signout")

    const adminLink = screen.queryByText("Admin")
    expect(adminLink).not.toBeInTheDocument()
  })

  it("should render a profile link and sign out button when user is signed as a member", async () => {
    const { user } = render(<NavigationBarMobile {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)

    const menuButton = screen.getByRole("button")
    expect(menuButton).toBeInTheDocument()
    await user.click(menuButton)

    const profileLink = screen.getByText("Profile")
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute("href", "/profile")

    const signOutLink = screen.getByText("Sign Out")
    expect(signOutLink).toBeInTheDocument()
    expect(signOutLink).toHaveAttribute("href", "/auth/signout")

    const adminLink = screen.queryByText("Admin")
    expect(adminLink).not.toBeInTheDocument()
  })

  it("should render admin link in user menu when admin signed in", async () => {
    const { user } = render(<NavigationBarMobile {...NAVIGATION_BAR_ADMIN_TEST_CONSTANTS} />)

    const menuButton = screen.getByRole("button")
    expect(menuButton).toBeInTheDocument()
    await user.click(menuButton)

    const profileLink = screen.getByText("Profile")
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute("href", "/profile")

    const signOutLink = screen.getByText("Sign Out")
    expect(signOutLink).toBeInTheDocument()
    expect(signOutLink).toHaveAttribute("href", "/auth/signout")

    const adminLink = screen.queryByText("Admin")
    expect(adminLink).toBeInTheDocument()
    expect(adminLink).toHaveAttribute("href", "/admin")
  })

  it("should render a backdrop when menu is open", async () => {
    const { user } = render(<NavigationBarMobile {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)

    const backdrop = screen.getByTestId("navbar-mobile-backdrop")
    expect(backdrop).not.toBeVisible()

    const menuButton = screen.getByRole("button")
    expect(menuButton).toBeInTheDocument()
    await user.click(menuButton)

    expect(backdrop).toBeInTheDocument()
    await waitFor(() => expect(backdrop).toBeVisible())
  })
})

describe("<NavigationBarDesktop />", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/book")
  })

  afterEach(() => {
    mockUsePathname.mockReset()
  })

  it("should re-export the NavigationBarDesktop component anc child components and check if they exist", () => {
    expect(NavigationBarModule.NavigationBarDesktop).toBeDefined()
    expect(
      isValidElement(
        <NavigationBarModule.NavigationBarDesktop {...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS} />,
      ),
    ).toBeTruthy()
  })

  it("should render the NavigationBarDesktop with correct props", () => {
    render(<NavigationBarDesktop {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)
    expect(screen.getByText("Book")).toBeInTheDocument()
    expect(screen.getByText("About")).toBeInTheDocument()
    expect(screen.getByText("Contact")).toBeInTheDocument()
  })

  it("should render admin link in user menu when admin signed in", async () => {
    const { user } = render(<NavigationBarDesktop {...NAVIGATION_BAR_ADMIN_TEST_CONSTANTS} />)

    const userMenu = screen.getByTestId("navbar-user-menu-avatar")
    expect(userMenu).toBeInTheDocument()
    await user.click(userMenu)

    const adminLink = screen.getByTestId("navbar-user-menu-admin-link")
    expect(adminLink).toBeInTheDocument()
    expect(adminLink).toHaveAttribute("href", "/admin")
  })

  it("should not render admin button when casual, member, or nobody is signed in", () => {
    render(<NavigationBarDesktop {...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS} />)
    expect(screen.queryByText("Admin")).not.toBeInTheDocument()

    render(<NavigationBarDesktop {...NAVIGATION_BAR_CASUAL_TEST_CONSTANTS} />)
    expect(screen.queryByText("Admin")).not.toBeInTheDocument()

    render(<NavigationBarDesktop {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)
    expect(screen.queryByText("Admin")).not.toBeInTheDocument()
  })

  it("should render sign in button when user is not signed in", () => {
    render(<NavigationBarDesktop {...NAVIGATION_BAR_NO_USER_TEST_CONSTANTS} />)
    const signInButton = screen.getByText("Sign In")
    expect(signInButton).toBeInTheDocument()
    expect(signInButton).toHaveAttribute("href", "/auth/signin")
  })

  it("should render user menu when user is signed in", () => {
    render(<NavigationBarDesktop {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)
    const userMenu = screen.getByTestId("navbar-user-menu-avatar")
    expect(userMenu).toBeInTheDocument()
  })

  it("should highlight the current url", async () => {
    render(<NavigationBarDesktop {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)
    const indicator = screen.getByTestId("navbar-hover-indicator")
    expect(indicator).toBeInTheDocument()

    const indicatorPosition = indicator.getBoundingClientRect()
    const bookButton = screen.getByText("Book")
    expect(bookButton).toBeInTheDocument()
    const bookButtonPosition = bookButton.getBoundingClientRect()
    expect(indicatorPosition).toStrictEqual(bookButtonPosition)
  })

  it("should move indicator to the hovered button", async () => {
    const { user } = render(<NavigationBarDesktop {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)

    const initialIndicator = screen.getByTestId("navbar-hover-indicator")
    expect(initialIndicator).toBeInTheDocument()

    const contactButton = screen.getByText("Contact")
    expect(contactButton).toBeInTheDocument()
    const contactButtonPosition = contactButton.getBoundingClientRect()

    await user.hover(contactButton)

    await waitFor(() => {
      const indicators = screen.getAllByTestId("navbar-hover-indicator")
      expect(indicators).toHaveLength(2)

      const hoverIndicator = indicators.find(
        (indicator) =>
          indicator.getBoundingClientRect().left === contactButtonPosition.left &&
          indicator.getBoundingClientRect().width === contactButtonPosition.width,
      )

      expect(hoverIndicator).toBeInTheDocument()
    })
  })

  it("should clear hover indicator when mouse leaves the navbar", async () => {
    mockUsePathname.mockReturnValue("/unknown-url")
    const { user } = render(<NavigationBarDesktop {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)

    expect(screen.queryByTestId("navbar-hover-indicator")).not.toBeInTheDocument()

    const bookButton = screen.getByText("Book")
    expect(bookButton).toBeInTheDocument()
    await user.hover(bookButton)
    await waitFor(() => {
      expect(screen.getByTestId("navbar-hover-indicator")).toBeInTheDocument()
    })

    await user.unhover(bookButton)
    await user.hover(screen.getByTestId("navbar-buttons-container"))
    await user.unhover(screen.getByTestId("navbar-buttons-container"))
    await waitForElementToBeRemoved(() => screen.queryByTestId("navbar-hover-indicator"))
  })

  it("should return indicator to current url when other button is unhovered", async () => {
    const { user } = render(<NavigationBarDesktop {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)

    const initialIndicator = screen.getByTestId("navbar-hover-indicator")
    expect(initialIndicator).toBeInTheDocument()
    const initialPosition = initialIndicator.getBoundingClientRect()

    const aboutButton = screen.getByText("About")
    expect(aboutButton).toBeInTheDocument()
    await user.hover(aboutButton)
    await waitFor(() => {
      expect(initialIndicator).toHaveStyle({ opacity: "0.25" })
    })

    const aboutIndicator = screen.getAllByTestId("navbar-hover-indicator")[1]
    expect(aboutIndicator).toBeInTheDocument()
    const aboutPosition = aboutIndicator.getBoundingClientRect()
    expect(aboutPosition).toStrictEqual(aboutButton.getBoundingClientRect())
    expect(aboutIndicator).not.toBe(initialIndicator)

    await user.unhover(aboutButton)
    await user.hover(screen.getByTestId("navbar-buttons-container"))
    await user.unhover(screen.getByTestId("navbar-buttons-container"))

    await waitFor(() => {
      expect(aboutIndicator).toHaveStyle({ opacity: "0.25" })
    })

    const returnedIndicator = screen.getAllByTestId("navbar-hover-indicator")[0]
    expect(returnedIndicator).toBeInTheDocument()
    expect(returnedIndicator).toHaveStyle({ opacity: "1" })
    const returnedPosition = returnedIndicator.getBoundingClientRect()
    expect(returnedPosition).toStrictEqual(initialPosition)
  })

  it("should not show indicator when current url does not match any nav item", () => {
    mockUsePathname.mockReturnValue("/unknown-url")
    render(<NavigationBarDesktop {...NAVIGATION_BAR_MEMBER_TEST_CONSTANTS} />)
    expect(screen.queryByTestId("navbar-hover-indicator")).not.toBeInTheDocument()
  })
})

describe("<NavigationBarButton />", () => {
  it("should re-export the NavigationBarButton component and check if it exists", () => {
    expect(NavigationBarModule.NavigationBarButton).toBeDefined()
    expect(
      isValidElement(<NavigationBarModule.NavigationBarButton label="Test" url="/" />),
    ).toBeTruthy()
  })

  it("should render the NavigationBarButton with correct props", () => {
    render(<NavigationBarButton label="Test Button" url="/test" />)
    expect(screen.getByText("Test Button")).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveAttribute("href", "/test")
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<NavigationBarButton label="Ref Test" ref={ref} url="/ref-test" />)
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("should display hover indicator when hovered", async () => {
    render(<NavigationBarButton hovering={true} label="Hover Test" url="/hover-test" />)

    const indicator = screen.getByTestId("navbar-hover-indicator")
    expect(indicator).toBeInTheDocument()
    await waitFor(() => {
      expect(indicator).toHaveStyle({ opacity: "1" })
    })

    const button = screen.getByText("Hover Test")
    expect(button.getBoundingClientRect()).toStrictEqual(indicator.getBoundingClientRect())
  })
})

describe("<NavigationBarUserMenu />", () => {
  it("should re-export the NavigationBarUserMenu component and check if it exists", () => {
    expect(NavigationBarModule.NavigationBarUserMenu).toBeDefined()

    expect(
      isValidElement(
        <NavigationBarModule.NavigationBarUserMenu {...NAVIGATION_BAR_USER_MENU_TEST_CONSTANTS} />,
      ),
    ).toBeTruthy()
  })

  it("should render the NavigationBarUserMenu with correct menu items for non-admin", async () => {
    const { user } = render(
      <NavigationBarModule.NavigationBarUserMenu {...NAVIGATION_BAR_USER_MENU_TEST_CONSTANTS} />,
    )

    const userMenu = screen.getByTestId("navbar-user-menu-avatar")
    expect(userMenu).toBeInTheDocument()

    const menuTrigger = screen.getByRole("button")
    await user.click(menuTrigger)

    const mockName = NAVIGATION_BAR_USER_MENU_TEST_CONSTANTS.avatarProps.name
    expect(screen.getByText(mockName)).toBeInTheDocument()

    const profileLink = screen.getByTestId("navbar-user-menu-profile-link")
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute("href", "/profile")

    const signOutLink = screen.getByTestId("navbar-user-menu-signout-link")
    expect(signOutLink).toBeInTheDocument()
    expect(signOutLink).toHaveAttribute("href", "/auth/signout")
  })

  it("should render the NavigationBarUserMenu with correct menu items for admin", async () => {
    const { user } = render(
      <NavigationBarModule.NavigationBarUserMenu
        admin
        {...NAVIGATION_BAR_USER_MENU_TEST_CONSTANTS}
      />,
    )

    const userMenu = screen.getByTestId("navbar-user-menu-avatar")
    expect(userMenu).toBeInTheDocument()

    const menuTrigger = screen.getByRole("button")
    await user.click(menuTrigger)

    const mockName = NAVIGATION_BAR_USER_MENU_TEST_CONSTANTS.avatarProps.name
    expect(screen.getByText(mockName)).toBeInTheDocument()

    const adminLink = screen.getByTestId("navbar-user-menu-admin-link")
    expect(adminLink).toBeInTheDocument()
    expect(adminLink).toHaveAttribute("href", "/admin")

    const profileLink = screen.getByTestId("navbar-user-menu-profile-link")
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute("href", "/profile")

    const signOutLink = screen.getByTestId("navbar-user-menu-signout-link")
    expect(signOutLink).toBeInTheDocument()
    expect(signOutLink).toHaveAttribute("href", "/auth/signout")
  })
})
