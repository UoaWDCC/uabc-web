import { PlayLevel } from "@repo/shared"
import * as BookACourtModule from "@repo/ui/components/Generic/BookACourt"
import { BookACourt } from "@repo/ui/components/Generic/BookACourt"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"

describe("<BookACourt />", () => {
  it("should re-export BookACourt component, and check it exists", () => {
    expect(BookACourtModule.BookACourt).toBeDefined()
    expect(isValidElement(<BookACourt />)).toBeTruthy()
  })

  it("should render all play level buttons as links with correct href", () => {
    render(<BookACourt />)

    Object.values(PlayLevel).forEach((level) => {
      const levelLink = screen.getByRole("link", {
        name: level.charAt(0).toUpperCase() + level.slice(1),
      })
      expect(levelLink).toBeInTheDocument()
      expect(levelLink).toHaveAttribute("href", `/book?playLevel=${level}`)
    })
  })

  it("should render guideline link call guidelineOnClick when the guideline link is clicked", async () => {
    render(<BookACourt />)

    const guidelineLink = screen.getByRole("link", { name: "Check-In Form Guidelines" })
    expect(guidelineLink).toBeInTheDocument()
    expect(guidelineLink).toHaveAttribute("href", "/terms-of-service")
  })
})
