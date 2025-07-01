import { LOCATION_BUBBLE_TEST_CONSTANTS } from "@repo/ui/test-config/constants"
import { render, screen } from "@repo/ui/test-utils"
import { userEvent } from "@testing-library/user-event"
import { isValidElement } from "react"
import * as LocationBubbleModule from "./index"
import { LocationBubble } from "./LocationBubble"

describe("<LocationBubble />", () => {
  it("should re-export the LocationBubble component and check if LocationBubble and child elements exists", () => {
    expect(LocationBubbleModule.LocationBubble).toBeDefined()
    expect(
      isValidElement(<LocationBubbleModule.LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />),
    ).toBeTruthy()
    expect(
      isValidElement(
        <LocationBubbleModule.LocationBubbleCircle {...LOCATION_BUBBLE_TEST_CONSTANTS} />,
      ),
    ).toBeTruthy()
    expect(
      isValidElement(
        <LocationBubbleModule.LocationBubbleDesktopCard {...LOCATION_BUBBLE_TEST_CONSTANTS} />,
      ),
    ).toBeTruthy()
    expect(
      isValidElement(
        <LocationBubbleModule.LocationBubbleMobileCard {...LOCATION_BUBBLE_TEST_CONSTANTS} />,
      ),
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
    render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    await userEvent.hover(bubble)
    expect(await screen.findByTestId("location-bubble-desktop-card")).toBeInTheDocument()
  })

  // it("unmounts desktop card after hovering ends", async () => {
  //   const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

  //   const bubble = screen.getByTestId("location-bubble-circle-trigger")
  //   await user.hover(bubble)
  //   expect(await screen.findByTestId("location-bubble-desktop-card")).toBeInTheDocument()

  //   const cardWrapper = screen.getByTestId("location-bubble-desktop-card-wrapper")
  //   await user.unhover(cardWrapper)
  //   expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()
  // })

  // it("does not render LocationBubbleDesktopCard when hovering for less than 100ms", async () => {
  //   vi.useFakeTimers()

  //   const { user } = render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)

  //   const bubble = screen.getByTestId("location-bubble-circle-trigger")

  //   await user.hover(bubble)
  //   act(() => vi.advanceTimersByTime(50))

  //   await user.unhover(bubble)
  //   expect(screen.queryByTestId("location-bubble-desktop-card")).toBeNull()

  //   vi.useRealTimers()
  // })

  it("renders LocationBubbleMobileCard when clicked", async () => {
    render(<LocationBubble {...LOCATION_BUBBLE_TEST_CONSTANTS} />)
    const bubble = screen.getByTestId("location-bubble-circle-trigger")
    await userEvent.click(bubble)
    expect(await screen.findByTestId("location-bubble-mobile-card")).toBeInTheDocument()
  })
})
