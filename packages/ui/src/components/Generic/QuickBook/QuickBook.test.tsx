import "@testing-library/jest-dom"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"
import * as QuickBookModule from "./index"
import { QuickBook } from "./QuickBook"

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
})
