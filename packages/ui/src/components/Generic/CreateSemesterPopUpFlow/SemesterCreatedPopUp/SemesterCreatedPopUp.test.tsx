import { render, screen } from "@repo/ui/test-utils"
import { Button } from "@yamada-ui/react"
import { isValidElement, useState } from "react"
import * as SemesterCreatedPopUpModule from "."
import { SemesterCreatedPopUp, type SemesterCreatedPopUpProps } from "./SemesterCreatedPopUp"

const SemesterCreatedPopUpExample = ({
  onClose,
  ...props
}: Omit<SemesterCreatedPopUpProps, "open">) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Semester Created PopUp</Button>
      <SemesterCreatedPopUp onClose={handleClose} open={open} {...props} />
    </>
  )
}

const requiredProps = {
  title: "Test Title",
  onClose: vi.fn(),
}

const customProps = {
  ...requiredProps,
  subtitle: "Test Subtitle",
}

describe("<SemesterCreatedPopUp />", () => {
  it("should re-export SemesterCreatedPopUp component and check it exists", () => {
    expect(SemesterCreatedPopUpModule.SemesterCreatedPopUp).toBeDefined()
    expect(
      isValidElement(
        <SemesterCreatedPopUpModule.SemesterCreatedPopUp onClose={() => {}} title="" />,
      ),
    ).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(SemesterCreatedPopUp.displayName).toBe("SemesterCreatedPopUp")
  })

  it("should render title and close button", async () => {
    const { user } = render(<SemesterCreatedPopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
  })

  it("should render with subtitle", async () => {
    const { user } = render(<SemesterCreatedPopUpExample {...customProps} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument()
  })

  it("should handle close button click", async () => {
    const onClose = vi.fn()
    const { user } = render(<SemesterCreatedPopUpExample onClose={onClose} title="Test Title" />)
    await user.click(screen.getByText("Open Semester Created PopUp"))

    const closeButton = screen.getByRole("button", { name: "Close" })
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })
})
