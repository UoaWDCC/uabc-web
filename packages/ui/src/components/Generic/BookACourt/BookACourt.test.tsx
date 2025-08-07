import { PlayLevel } from "@repo/shared"
import * as BookACourtModule from "@repo/ui/components/Generic/BookACourt"
import { BookACourt } from "@repo/ui/components/Generic/BookACourt"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"

describe("<BookACourt />", () => {
  const mockOnSelect = vi.fn()

  it("should re-export BookACourt component, and check it exists", () => {
    expect(BookACourtModule.BookACourt).toBeDefined()
    expect(isValidElement(<BookACourt onSelect={mockOnSelect} />)).toBeTruthy()
  })

  test.each(Object.values(PlayLevel))(
    "should render play level button with correct text and call onSelect when clicked",
    async (level) => {
      const { user } = render(<BookACourt onSelect={mockOnSelect} />)

      const levelButton = screen.getByRole("button", { name: level })
      expect(levelButton).toBeInTheDocument()
      await user.click(levelButton)
      expect(mockOnSelect).toHaveBeenCalledWith(level)
    },
  )

  it("should render guideline link call guidelineOnClick when the guideline link is clicked", () => {
    render(<BookACourt onSelect={mockOnSelect} />)

    const guidelineLink = screen.getByRole("link", { name: "Check-In Form Guidelines" })
    expect(guidelineLink).toBeInTheDocument()
    expect(guidelineLink).toHaveAttribute("href", "/terms")
  })
})
