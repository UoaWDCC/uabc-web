import { PlayLevel, type QuickBookFormData } from "@repo/shared"
import { mockSessions } from "@repo/shared/mocks"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as QuickBookModule from "./index"
import { QuickBook } from "./QuickBook"

describe("<QuickBook />", () => {
  it("should re-export the QuickBook component and check if QuickBook exists", () => {
    expect(QuickBookModule.QuickBook).toBeDefined()
    expect(isValidElement(<QuickBookModule.QuickBook sessions={[]} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(QuickBook.displayName).toBe("QuickBook")
  })

  it("should render default submit button label correctly", () => {
    render(<QuickBook sessions={[]} />)

    // At base (mobile), the title is not displayed and cannot be tested for in a vitest test

    expect(screen.getByText("Book Now")).toBeInTheDocument()
  })

  it("should call onSubmit when a user clicks the submit button", async () => {
    const handleSubmit = vi.fn((data: QuickBookFormData) => data)

    const { user } = render(<QuickBook onSubmit={handleSubmit} sessions={mockSessions} />)

    const locationAndTimeSelect = screen.getByTestId("location-and-time")
    await user.click(locationAndTimeSelect)

    // The first session should be "Tue | 19:30 - 22:00 | UoA Recreation Centre"
    await user.click(screen.getByText("Tue | 19:30 - 22:00 | UoA Recreation Centre"))

    const skillLevelSelect = screen.getByTestId("skill-level")
    await user.click(skillLevelSelect)
    await user.click(screen.getByText(PlayLevel.beginner))

    const submitButton = screen.getByText("Book Now")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      locationAndTimeId: "lr66j8d0brq00d0jr460p9jx",
      skillLevel: "beginner",
    })
  })
})
