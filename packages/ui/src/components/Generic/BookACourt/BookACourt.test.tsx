import { PlayLevel } from "@repo/shared"
import * as BookACourtModule from "@repo/ui/components/Generic/BookACourt"
import { BookACourt } from "@repo/ui/components/Generic/BookACourt"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"

const mockBookACourtProps = {
  guidelineOnClick: vi.fn(),
}

describe("<BookACourt />", () => {
  it("should re-export BookACourt component, and check it exists", () => {
    expect(BookACourtModule.BookACourt).toBeDefined()
    expect(isValidElement(<BookACourt {...mockBookACourtProps} />)).toBeTruthy()
  })

  it("should render all play level buttons as links with correct href", () => {
    render(<BookACourt {...mockBookACourtProps} />)

    Object.values(PlayLevel).forEach((level) => {
      const levelLink = screen.getByRole("link", {
        name: level.charAt(0).toUpperCase() + level.slice(1),
      })
      expect(levelLink).toBeInTheDocument()
      expect(levelLink).toHaveAttribute("href", `/book?playLevel=${level}`)
    })
  })

  it("should render guideline link call guidelineOnClick when the guideline link is clicked", async () => {
    const { user } = render(<BookACourt {...mockBookACourtProps} />)

    const guidelineLink = screen.getByRole("button", { name: "Check-In Form Guidelines" })
    expect(guidelineLink).toBeInTheDocument()
    await user.click(guidelineLink)

    const { guidelineOnClick } = mockBookACourtProps

    expect(guidelineOnClick).toHaveBeenCalled()
  })
})
