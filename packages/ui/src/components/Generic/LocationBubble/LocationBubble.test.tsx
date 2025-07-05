vi.mock("@yamada-ui/react", async () => {
  const actual = await vi.importActual<typeof import("@yamada-ui/react")>("@yamada-ui/react")
  return {
    ...actual,
    useReducedMotion: vi.fn(),
  }
})

import {
  LOCATION_BUBBLE_TEST_CONSTANTS,
  LOCATION_BUBBLE_TEST_CONSTANTS_MOBILE,
} from "@repo/ui/test-config/mocks/LocationBubble.mock"
import { render, screen, sleep } from "@repo/ui/test-utils"
import { useReducedMotion } from "@yamada-ui/react"
import { isValidElement } from "react"
import { LocationBubble } from "."
import * as LocationBubbleModule from "./index"
import { LocationBubbleDesktopCard } from "./LocationBubbleDesktopCard"
import { LocationBubbleMobileCard } from "./LocationBubbleMobileCard"

const mockUseReducedMotion = vi.mocked(useReducedMotion)

describe("<LocationBubble />", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
  })

  it("should re-export the LocationBubble component and check if LocationBubble component exists", () => {
    expect(LocationBubbleModule.LocationBubble).toBeDefined()
    expect(
      isValidElement(<LocationBubbleModule.LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />),
    ).toBeTruthy()
  })

  it("renders LocationBubble", () => {
    render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    expect(screen.getByTestId("location-bubble")).toBeInTheDocument()
  })

  it("renders LocationBubbleCircle by default", () => {
    render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    expect(screen.getByTestId("location-bubble-circle")).toBeInTheDocument()
  })

  it("renders LocationBubbleDesktopCard when hovering by default", async () => {
    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    expect(screen.queryByTestId("location-bubble-desktop-card")).not.toBeInTheDocument()
    await user.hover(bubble)
    expect(await screen.findByTestId("location-bubble-desktop-card")).toBeInTheDocument()
  })

  it("unmounts desktop card after hovering ends", async () => {
    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()

    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    await user.hover(bubble)
    expect(await screen.findByTestId("location-bubble-desktop-card")).toBeInTheDocument()

    const cardWrapper = screen.getByTestId("location-bubble-desktop-card-wrapper")

    await user.hover(cardWrapper)
    await sleep(100)

    await user.unhover(cardWrapper)
    await sleep(100)

    expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()
  })

  it("does not render LocationBubbleDesktopCard when hovering for less than 100ms", async () => {
    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    const bubble = screen.getByTestId("location-bubble-circle-trigger")

    await user.hover(bubble)
    await sleep(50)
    expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()
    expect(screen.getByTestId("location-bubble-circle-trigger")).toBeInTheDocument()
  })

  it("does not render LocationBubbleDesktopCard when hovering for less than 100ms and then unhovered", async () => {
    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    const bubble = screen.getByTestId("location-bubble-circle-trigger")

    await user.hover(bubble)
    await sleep(50)
    await user.unhover(bubble)
    await sleep(50)
    expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()
    expect(screen.getByTestId("location-bubble-circle-trigger")).toBeInTheDocument()
  })

  it("falls back to '#' for href if no path is provided in LocationBubbleMobileCard", async () => {
    render(<LocationBubbleDesktopCard {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    const button = screen.getByRole("link", { name: /learn more/i })
    expect(button).toHaveAttribute("href", "#")
  })

  it("renders LocationBubbleMobileCard when clicked", async () => {
    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    expect(screen.queryByTestId("location-bubble-mobile-card")).toBeNull()

    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    await user.click(bubble)
    expect(await screen.findByTestId("location-bubble-mobile-card")).toBeInTheDocument()
  })

  it("falls back to '#' for href if no path is provided in LocationBubbleMobileCard", async () => {
    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    await user.click(bubble)

    const mobileCard = await screen.findByTestId("location-bubble-mobile-card")
    const link = mobileCard.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link?.getAttribute("href")).toBe("#")
  })

  it("falls back to '#' for href if no path is provided in LocationBubbleMobileCard", async () => {
    render(<LocationBubbleMobileCard {...LOCATION_BUBBLE_TEST_CONSTANTS_MOBILE} />)

    const button = screen.getByRole("link", { name: /learn more/i })
    expect(button).toHaveAttribute("href", "#")
  })

  it("LocationBubble doesn't move when prefers-reduced-motion is true", async () => {
    mockUseReducedMotion.mockReturnValue(true)

    render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    const bubbleWithReducedMotion = screen.getByTestId("location-bubble-circle-trigger")

    const transformInitial = window.getComputedStyle(bubbleWithReducedMotion).transform
    await sleep(200)
    const transformLater = window.getComputedStyle(bubbleWithReducedMotion).transform

    expect(transformLater).toBe(transformInitial)
    expect(transformLater).toBe("none")
  })

  it("LocationBubble moves when prefers-reduced-motion is false", async () => {
    mockUseReducedMotion.mockReturnValue(false)

    render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    const bubbleWithMotion = screen.getByTestId("location-bubble-circle-trigger")

    const transformInitial = window.getComputedStyle(bubbleWithMotion).transform
    expect(transformInitial).toBeOneOf(["translateX(25px)", "translateX(-25px)"])
    await sleep(200)
    const transformMiddle = window.getComputedStyle(bubbleWithMotion).transform
    expect(transformMiddle).not.toBeOneOf(["translateX(25px)", "translateX(-25px)"])
    await sleep(200)
    const transformLater = window.getComputedStyle(bubbleWithMotion).transform
    expect(transformLater).not.toBeOneOf(["translateX(25px)", "translateX(-25px)"])

    expect(transformInitial).not.toBe(transformMiddle)
    expect(transformMiddle).not.toBe(transformLater)
  })
})
