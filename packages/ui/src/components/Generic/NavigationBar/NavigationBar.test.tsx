vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    usePathname: vi.fn(),
  }
})

import * as NavigationBarModule from "@repo/ui/components/Generic/NavigationBar"
import { NAVIGATION_BAR_TEST_CONSTANTS } from "@repo/ui/test-config/mocks/NavigationBar.mock"
import { render, screen, sleep } from "@repo/ui/test-utils"
import { usePathname } from "next/navigation"
import { isValidElement } from "react"
import { NavigationBar } from "./NavigationBar"
import { NavigationBarButton } from "./NavigationBarButton"

const mockUsePathname = vi.mocked(usePathname)

describe("<NavigationBar />", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/book")
  })

  it("should re-export the NavigationBar component anc child components and check if they exists", () => {
    expect(NavigationBarModule.NavigationBar).toBeDefined()
    expect(isValidElement(<NavigationBarModule.NavigationBar navItems={[]} />)).toBeTruthy()
  })

  it("should render the NavigationBar with correct props", () => {
    render(<NavigationBar {...NAVIGATION_BAR_TEST_CONSTANTS} />)
    expect(screen.getByText("Book")).toBeInTheDocument()
    expect(screen.getByText("About")).toBeInTheDocument()
    expect(screen.getByText("Contact")).toBeInTheDocument()
  })

  it("should render admin button when admin prop is true", () => {
    render(<NavigationBar admin={true} {...NAVIGATION_BAR_TEST_CONSTANTS} />)
    const adminButton = screen.getByText("Admin")
    expect(adminButton).toBeInTheDocument()
    expect(adminButton).toHaveAttribute("href", "/admin")
  })

  it("should not render admin button when admin prop is false", () => {
    render(<NavigationBar admin={false} {...NAVIGATION_BAR_TEST_CONSTANTS} />)
    expect(screen.queryByText("Admin")).not.toBeInTheDocument()
  })

  it("should render sign in button when user prop is not provided", () => {
    render(<NavigationBar navItems={NAVIGATION_BAR_TEST_CONSTANTS.navItems} />)
    const signInButton = screen.getByText("Sign In")
    expect(signInButton).toBeInTheDocument()
    expect(signInButton).toHaveAttribute("href", "/signin")
  })

  it("should render user menu when user prop is provided", async () => {
    render(<NavigationBar {...NAVIGATION_BAR_TEST_CONSTANTS} />)

    const userMenu = screen.getByTestId("navbar-user-menu-avatar")
    expect(userMenu).toBeInTheDocument()
  })

  it("should highlight the current path", async () => {
    render(<NavigationBar {...NAVIGATION_BAR_TEST_CONSTANTS} />)
    const indicator = screen.getByTestId("navbar-hover-indicator")
    expect(indicator).toBeInTheDocument()
    await sleep(500)
    expect(indicator).toBeVisible()
  })

  it("should move indicator to the hovered button", async () => {
    const { user } = render(<NavigationBar {...NAVIGATION_BAR_TEST_CONSTANTS} />)

    const initialIndicator = screen.getByTestId("navbar-hover-indicator")
    expect(initialIndicator).toBeInTheDocument()
    await sleep(500)
    expect(initialIndicator).toBeVisible()
    const initialPosition = initialIndicator.getBoundingClientRect()

    const contactButton = screen.getByText("Contact")
    expect(contactButton).toBeInTheDocument()

    await user.hover(contactButton)

    await sleep(500)

    const newIndicator = screen.getAllByTestId("navbar-hover-indicator")[1]
    expect(newIndicator).not.toBe(initialIndicator)
    expect(newIndicator).toBeInTheDocument()
    expect(newIndicator).toBeVisible()
    const newPosition = newIndicator.getBoundingClientRect()
    expect(newPosition).not.toBe(initialPosition)
  })

  it("should clear hover indicator when mouse leaves the navbar", async () => {
    mockUsePathname.mockReturnValue("/unknown-path")
    const { user } = render(<NavigationBar {...NAVIGATION_BAR_TEST_CONSTANTS} />)

    const bookButton = screen.getByText("Book")
    expect(bookButton).toBeInTheDocument()
    await user.hover(bookButton)
    await sleep(500)

    const indicator = screen.getByTestId("navbar-hover-indicator")
    expect(indicator).toBeInTheDocument()
    await sleep(500)
    expect(indicator).toBeVisible()

    await user.unhover(bookButton)
    await user.hover(screen.getByTestId("navbar-buttons-container"))
    await user.unhover(screen.getByTestId("navbar-buttons-container"))
    await sleep(500)
    expect(screen.queryByTestId("navbar-hover-indicator")).not.toBeInTheDocument()
  })

  it("should return indicator to current path when other button is unhovered", async () => {
    const { user } = render(<NavigationBar {...NAVIGATION_BAR_TEST_CONSTANTS} />)

    const aboutButton = screen.getByText("About")
    expect(aboutButton).toBeInTheDocument()

    const initialIndicator = screen.getByTestId("navbar-hover-indicator")
    expect(initialIndicator).toBeInTheDocument()

    await user.hover(aboutButton)
    await sleep(500)

    const hoveredIndicator = screen.getAllByTestId("navbar-hover-indicator")[1]
    expect(hoveredIndicator).toBeInTheDocument()
    expect(hoveredIndicator).toBeVisible()

    await user.unhover(aboutButton)
    await user.hover(screen.getByTestId("navbar-buttons-container"))
    await user.unhover(screen.getByTestId("navbar-buttons-container"))
    await sleep(1000)

    const returnedIndicator = screen.getAllByTestId("navbar-hover-indicator")[0]
    expect(returnedIndicator).toBeInTheDocument()
    expect(returnedIndicator).toBeVisible()
    expect(returnedIndicator).toBe(initialIndicator)
  })

  it("should not show indicator when current path does not match any nav item", () => {
    mockUsePathname.mockReturnValue("/unknown-path")
    render(<NavigationBar {...NAVIGATION_BAR_TEST_CONSTANTS} />)
    expect(screen.queryByTestId("navbar-hover-indicator")).not.toBeInTheDocument()
  })
})

describe("<NavigationBarButton />", () => {
  it("should re-export the NavigationBarButton component and check if it exists", () => {
    expect(NavigationBarModule.NavigationBarButton).toBeDefined()
    expect(
      isValidElement(<NavigationBarModule.NavigationBarButton label="Test" path="/" />),
    ).toBeTruthy()
  })

  it("should render the NavigationBarButton with correct props", () => {
    render(<NavigationBarButton label="Test Button" path="/test" />)
    expect(screen.getByText("Test Button")).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveAttribute("href", "/test")
  })

  it("should forward ref correctly", () => {
    const ref = { current: null }
    render(<NavigationBarButton label="Ref Test" path="/ref-test" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("should display hover indicator when hovered", async () => {
    render(<NavigationBarButton hovering={true} label="Hover Test" path="/hover-test" />)

    const indicator = screen.getByTestId("navbar-hover-indicator")
    expect(indicator).toBeInTheDocument()
    await sleep(500)
    expect(indicator).toBeVisible()
  })
})

describe("<NavigationBarUserMenu />", () => {
  it("should re-export the NavigationBarUserMenu component and check if it exists", () => {
    expect(NavigationBarModule.NavigationBarUserMenu).toBeDefined()
    expect(
      isValidElement(
        <NavigationBarModule.NavigationBarUserMenu
          avatarProps={{ ...NAVIGATION_BAR_TEST_CONSTANTS.user }}
        />,
      ),
    ).toBeTruthy()
  })

  it("should render the NavigationBarUserMenu with correct menu items", async () => {
    const mockUser = NAVIGATION_BAR_TEST_CONSTANTS.user
    const { user } = render(
      <NavigationBarModule.NavigationBarUserMenu avatarProps={{ ...mockUser }} />,
    )

    const userMenu = screen.getByTestId("navbar-user-menu-avatar")
    expect(userMenu).toBeInTheDocument()

    const menuTrigger = screen.getByRole("button")
    await user.click(menuTrigger)

    expect(screen.getByText(mockUser.name)).toBeInTheDocument()

    const profileLink = screen.getByTestId("navbar-user-menu-profile-link")
    expect(profileLink).toBeInTheDocument()
    expect(profileLink).toHaveAttribute("href", "/profile")

    const signOutLink = screen.getByTestId("navbar-user-menu-signout-link")
    expect(signOutLink).toBeInTheDocument()
    expect(signOutLink).toHaveAttribute("href", "/signout")
  })
})
