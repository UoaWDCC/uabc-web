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

  it("should render all play level buttons as links with correct href", () => {
    render(<BookACourt onSelect={mockOnSelect} />)

    Object.values(PlayLevel).forEach((level) => {
      const levelLink = screen.getByRole("link", {
        name: level,
      })
      expect(levelLink).toBeInTheDocument()
      expect(levelLink).toHaveAttribute("href", `/book?playLevel=${level}`)
    })
  })

  it("should render guideline link call guidelineOnClick when the guideline link is clicked", () => {
    render(<BookACourt onSelect={mockOnSelect} />)

    const guidelineLink = screen.getByRole("link", { name: "Check-In Form Guidelines" })
    expect(guidelineLink).toBeInTheDocument()
    expect(guidelineLink).toHaveAttribute("href", "/terms-of-service")
  })
})
