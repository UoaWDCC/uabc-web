vi.mock("@yamada-ui/react", async () => {
  const actual = await vi.importActual<typeof import("@yamada-ui/react")>("@yamada-ui/react")
  return {
    ...actual,
    useReducedMotion: vi.fn(),
    useBreakpointValue: vi.fn(),
  }
})

import {
  LOCATION_BUBBLE_TEST_CONSTANTS,
  LOCATION_BUBBLE_TEST_CONSTANTS_MOBILE,
} from "@repo/ui/test-config/mocks/LocationBubble.mock"
import { render, screen, waitFor } from "@repo/ui/test-utils"
import { useBreakpointValue, useReducedMotion } from "@yamada-ui/react"
import { isValidElement } from "react"
import { LocationBubble } from "."
import * as LocationBubbleModule from "./index"
import { LocationBubbleDesktopCard } from "./LocationBubbleDesktopCard"
import { LocationBubbleMobileCard } from "./LocationBubbleMobileCard"

const mockUseReducedMotion = vi.mocked(useReducedMotion)
const mockUseBreakpointValue = vi.mocked(useBreakpointValue)

describe("<LocationBubble />", () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReturnValue(false)
    vi.useFakeTimers({ shouldAdvanceTime: true })

    // Mock breakpoint value to allow hover functionality to work
    mockUseBreakpointValue.mockImplementation((config) => {
      return config.md || config.base
    })
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
    mockUseBreakpointValue.mockImplementation((config) => config.md)

    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    expect(screen.queryByTestId("location-bubble-desktop-card")).not.toBeInTheDocument()
    await user.hover(bubble)
    vi.advanceTimersToNextTimer()
    expect(await screen.findByTestId("location-bubble-desktop-card")).toBeInTheDocument()
  })

  it("unmounts desktop card after hovering ends", async () => {
    mockUseBreakpointValue.mockImplementation((config) => config.md)

    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()

    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    await user.hover(bubble)
    expect(await screen.findByTestId("location-bubble-desktop-card")).toBeInTheDocument()

    const cardWrapper = screen.getByTestId("location-bubble-hover-container")

    await user.hover(cardWrapper)
    vi.advanceTimersToNextTimer()

    await user.unhover(cardWrapper)
    vi.advanceTimersToNextTimer()

    expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()
  })

  it("does not render LocationBubbleDesktopCard when hovering for less than 100ms", async () => {
    mockUseBreakpointValue.mockImplementation((config) => config.md)

    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    const bubble = screen.getByTestId("location-bubble-circle-trigger")

    await user.hover(bubble)
    vi.advanceTimersByTime(50)
    expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()
    expect(screen.getByTestId("location-bubble-circle-trigger")).toBeInTheDocument()
  })

  it("does not render LocationBubbleDesktopCard when hovering for less than 100ms and then unhovered", async () => {
    mockUseBreakpointValue.mockImplementation((config) => config.md)

    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    const bubble = screen.getByTestId("location-bubble-circle-trigger")

    await user.hover(bubble)
    vi.advanceTimersByTime(50)
    await user.unhover(bubble)
    vi.advanceTimersByTime(50)

    expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()
    expect(screen.getByTestId("location-bubble-circle-trigger")).toBeInTheDocument()
  })

  it("falls back to '#' for href if no path is provided in LocationBubbleDesktopCard", async () => {
    render(<LocationBubbleDesktopCard {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

    const button = screen.getByRole("link", { name: /learn more/i })
    expect(button).toHaveAttribute("href", "#")
  })

  it("renders LocationBubbleMobileCard when clicked", async () => {
    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    expect(screen.queryByTestId("location-bubble-mobile-card")).toBeNull()

    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    await user.click(bubble)
    vi.advanceTimersToNextTimer()
    expect(await screen.findByTestId("location-bubble-mobile-card")).toBeInTheDocument()
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
    vi.advanceTimersByTime(200)
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

    waitFor(() => {
      const transformAfterHover = window.getComputedStyle(bubbleWithMotion).transform
      expect(transformAfterHover).not.toBeOneOf(["translateX(25px)", "translateX(-25px)"])
    })
  })

  it("does not show desktop card on hover when on mobile", async () => {
    mockUseBreakpointValue.mockImplementation((config) => config.base)

    const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    const bubble = screen.getByTestId("location-bubble-circle-trigger")

    await user.hover(bubble)
    vi.advanceTimersToNextTimer()

    expect(screen.queryByTestId("location-bubble-desktop-card")).not.toBeInTheDocument()
    expect(screen.getByTestId("location-bubble-circle-trigger")).toBeInTheDocument()
  })
})
