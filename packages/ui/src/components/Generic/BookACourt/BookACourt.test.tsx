import { PlayLevel } from "@repo/shared"
import * as BookACourtModule from "@repo/ui/components/Generic/BookACourt"
import { BookACourt } from "@repo/ui/components/Generic/BookACourt"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"

const mockBookACourtProps = {
  buttonOnClick: vi.fn(),
  guidelineOnClick: vi.fn(),
}

describe("<BookACourt />", () => {
  it("should re-export BookACourt component, and check it exists", () => {
    expect(BookACourtModule.BookACourt).toBeDefined()
    expect(isValidElement(<BookACourt {...mockBookACourtProps} />)).toBeTruthy()
  })

  it("should render all play levels and guidelines as buttons", () => {
    render(<BookACourt {...mockBookACourtProps} />)

    Object.values(PlayLevel).forEach((level) => {
      expect(
        screen.getByRole("button", { name: level.charAt(0).toUpperCase() + level.slice(1) }),
      ).toBeInTheDocument()
    })

    expect(screen.getByRole("button", { name: "Check-In Form Guidelines" })).toBeInTheDocument()
  })

  it("should call buttonOnClick with the correct play level when a button is clicked", async () => {
    const { user } = render(<BookACourt {...mockBookACourtProps} />)

    const beginnerButton = screen.getByRole("button", { name: "Beginner" })
    await user.click(beginnerButton)

    const { buttonOnClick } = mockBookACourtProps

    expect(buttonOnClick).toHaveBeenCalledWith(PlayLevel.beginner)
  })

  it("should call guidelineOnClick when the guideline link is clicked", async () => {
    const { user } = render(<BookACourt {...mockBookACourtProps} />)

    const guidelineLink = screen.getByRole("button", { name: "Check-In Form Guidelines" })
    await user.click(guidelineLink)

    const { guidelineOnClick } = mockBookACourtProps

    expect(guidelineOnClick).toHaveBeenCalled()
  })
})
