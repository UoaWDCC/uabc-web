import "@testing-library/jest-dom"
import { PlayLevel } from "@repo/shared"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as QuickBookModule from "./index"
import { QuickBook, type QuickBookFormValues } from "./QuickBook"
import { locationAndTimeOptionsMock } from "./QuickBook.mock"

describe("<QuickBook />", () => {
  it("should re-export the QuickBook component and check if QuickBook exists", () => {
    expect(QuickBookModule.QuickBook).toBeDefined()
    expect(isValidElement(<QuickBookModule.QuickBook locationAndTimeOptions={[]} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(QuickBook.displayName).toBe("QuickBook")
  })

  it("should render default submit button label correctly", () => {
    render(<QuickBook locationAndTimeOptions={[]} />)

    // At base (mobile), the title is not displayed and cannot be tested for in a vitest test

    expect(screen.getByText("Book Now")).toBeInTheDocument()
  })

  it("should call onSubmit when a user clicks the submit button", async () => {
    const handleSubmit = vi.fn((data: QuickBookFormValues) => data)

    const { user } = render(
      <QuickBook locationAndTimeOptions={locationAndTimeOptionsMock} onSubmit={handleSubmit} />,
    )

    const locationAndTimeSelect = screen.getByTestId("location-and-time")
    await user.click(locationAndTimeSelect)
    await user.click(screen.getByText(locationAndTimeOptionsMock[0].label as string))

    const skillLevelSelect = screen.getByTestId("skill-level")
    await user.click(skillLevelSelect)
    await user.click(screen.getByText(PlayLevel.BEGINNER))

    const submitButton = screen.getByText("Book Now")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      // cspell:disable-next-line
      locationAndTimeId: "lr66j8dobrqoodojr460p9jx",
      skillLevel: "beginner",
    })
  })
})
