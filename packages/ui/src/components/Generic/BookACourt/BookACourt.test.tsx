import { PlayLevel } from "@repo/shared"
import * as BookACourtModule from "@repo/ui/components/Generic/BookACourt"
import { BookACourt } from "@repo/ui/components/Generic/BookACourt"
import { render, screen } from "@repo/ui/test-utils"
import { isValidElement } from "react"

describe("<BookACourt />", () => {
  it("should re-export BookACourt component, and check it exists", () => {
    expect(BookACourtModule.BookACourt).toBeDefined()
    expect(isValidElement(<BookACourt onClick={() => {}} />)).toBeTruthy()
  })

  it("should render all play levels as buttons", () => {
    const onClickMock = vi.fn()
    render(<BookACourt onClick={onClickMock} />)

    Object.values(PlayLevel).forEach((level) => {
      expect(
        screen.getByRole("button", { name: level.charAt(0).toUpperCase() + level.slice(1) }),
      ).toBeInTheDocument()
    })
  })

  it("should call onClick with the correct play level when a button is clicked", async () => {
    const onClickMock = vi.fn()
    const { user } = render(<BookACourt onClick={onClickMock} />)

    const beginnerButton = screen.getByRole("button", { name: "Beginner" })
    await user.click(beginnerButton)

    expect(onClickMock).toHaveBeenCalledWith(PlayLevel.beginner)
  })
})
