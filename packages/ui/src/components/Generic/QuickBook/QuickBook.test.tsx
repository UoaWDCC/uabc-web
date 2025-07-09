import "@testing-library/jest-dom"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as QuickBookModule from "./index"
import { QuickBook } from "./QuickBook"
import { locationAndTimeOptionsMock, skillLevelOptionsMock } from "./QuickBook.mock"
import type { UIQuickBookFormValues } from "./schema"

describe("<QuickBook />", () => {
  it("should re-export the Select component and check if Select exists", () => {
    expect(QuickBookModule.QuickBook).toBeDefined()
    expect(
      isValidElement(
        <QuickBookModule.QuickBook locationAndTimeOptions={[]} skillLevelOptions={[]} />,
      ),
    ).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(QuickBook.displayName).toBe("QuickBook")
  })

  it("should render default submit button label correctly", () => {
    render(<QuickBook locationAndTimeOptions={[]} skillLevelOptions={[]} />)

    // At base (mobile), the title is not displayed and cannot be tested for in a vitest test

    expect(screen.getByText("Book Now")).toBeInTheDocument()
  })

  it("should call onSubmit when a user clicks the submit button", async () => {
    const handleSubmit = vi.fn((data: UIQuickBookFormValues) => data)

    const { user } = render(
      <QuickBook
        locationAndTimeOptions={locationAndTimeOptionsMock}
        onSubmit={handleSubmit}
        skillLevelOptions={skillLevelOptionsMock}
      />,
    )

    const locationAndTimeSelect = screen.getByTestId("location-and-time")
    await user.click(locationAndTimeSelect)
    await user.click(screen.getByText(locationAndTimeOptionsMock[0].label as string))

    const skillLevelSelect = screen.getByTestId("skill-level")
    await user.click(skillLevelSelect)
    await user.click(screen.getByText(skillLevelOptionsMock[0].label as string))

    const submitButton = screen.getByText("Book Now")
    await user.click(submitButton)

    expect(handleSubmit).toReturnWith({
      locationAndTimeId: "lr66j8dobrqoodojr460p9jx",
      skillLevel: "beginner",
    })
  })
})
