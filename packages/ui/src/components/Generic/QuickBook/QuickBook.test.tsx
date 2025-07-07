import "@testing-library/jest-dom"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as QuickBookModule from "./index"
import { QuickBook } from "./QuickBook"
import { locationAndTimeOptionsMock, skillLevelOptionsMock } from "./QuickBook.mock"

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

  it("should render default title and submit button label correctly", () => {
    render(<QuickBook locationAndTimeOptions={[]} skillLevelOptions={[]} />)

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument()
    expect(screen.getByText("Quick Book")).toBeInTheDocument()
    expect(screen.getByText("Book Now")).toBeInTheDocument()
  })

  it("should call onSubmit when a user clicks the submit button", async () => {
    const onSubmit = vi.fn()

    const { user } = render(
      <QuickBook
        handleSubmit={onSubmit}
        locationAndTimeOptions={locationAndTimeOptionsMock}
        skillLevelOptions={skillLevelOptionsMock}
      />,
    )

    const locationAndTimeSelect = screen.getByTestId("location-and-time")
    await user.click(locationAndTimeSelect)
    await user.click(screen.getByText(locationAndTimeOptionsMock[0].label as string)) // TODO: chg if doesn't work

    const skillLevelSelect = screen.getByTestId("skill-level")
    await user.click(skillLevelSelect)
    await user.click(screen.getByText(skillLevelOptionsMock[0].label as string)) // TODO: chg if doesn't work

    const submitButton = screen.getByText("Book Now")
    await user.click(submitButton)
    expect(onSubmit).toBeCalled()
  })
})
