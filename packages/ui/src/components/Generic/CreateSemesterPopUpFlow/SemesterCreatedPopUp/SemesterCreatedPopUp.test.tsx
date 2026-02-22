import { render, screen } from "@repo/ui/test-utils"
import { Button } from "@yamada-ui/react"
import { isValidElement, useState } from "react"
import * as SemesterCreatedPopUpModule from "."
import { SemesterCreatedPopUp, type SemesterCreatedPopUpProps } from "./SemesterCreatedPopUp"

const mockData = {
  name: "Semester 1 2025",
  startDate: "2025-02-24T00:00:00.000Z",
  endDate: "2025-06-20T00:00:00.000Z",
  breakStart: "2025-04-14T00:00:00.000Z",
  breakEnd: "2025-04-25T00:00:00.000Z",
  bookingOpenDay: "monday",
  bookingOpenTime: "1970-01-01T20:00:00.000Z",
}

const SemesterCreatedPopUpExample = ({
  onClose,
  onConfirm,
  ...props
}: Omit<SemesterCreatedPopUpProps, "open">) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  const handleConfirm = () => {
    setOpen(false)
    onConfirm?.()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Semester Created PopUp</Button>
      <SemesterCreatedPopUp
        onClose={handleClose}
        onConfirm={handleConfirm}
        open={open}
        {...props}
      />
    </>
  )
}

const requiredProps: Omit<SemesterCreatedPopUpProps, "open"> = {
  title: "Semester Creation Confirmation",
  data: mockData,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
}

describe("<SemesterCreatedPopUp />", () => {
  it("should re-export SemesterCreatedPopUp component and check it exists", () => {
    expect(SemesterCreatedPopUpModule.SemesterCreatedPopUp).toBeDefined()
    expect(
      isValidElement(
        <SemesterCreatedPopUpModule.SemesterCreatedPopUp
          data={mockData}
          onClose={() => {}}
          onConfirm={() => {}}
          open={false}
          title=""
        />,
      ),
    ).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(SemesterCreatedPopUp.displayName).toBe("SemesterCreatedPopUp")
  })

  it("should render title and confirm button", async () => {
    const { user } = render(<SemesterCreatedPopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))

    expect(screen.getByText("Semester Creation Confirmation")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
  })

  it("should render all semester data fields", async () => {
    const { user } = render(<SemesterCreatedPopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))

    expect(screen.getByText("Semester 1 2025")).toBeInTheDocument()
    expect(screen.getByText("Monday")).toBeInTheDocument()
    expect(screen.getByText("8:00 PM")).toBeInTheDocument()
  })

  it("should render section headings", async () => {
    const { user } = render(<SemesterCreatedPopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))

    expect(screen.getByText("Semester")).toBeInTheDocument()
    expect(screen.getByText("Break Period")).toBeInTheDocument()
    expect(screen.getByText("Booking Settings")).toBeInTheDocument()
  })

  it("should call onConfirm when confirm button is clicked", async () => {
    const onConfirm = vi.fn()
    const { user } = render(
      <SemesterCreatedPopUpExample {...requiredProps} onConfirm={onConfirm} />,
    )
    await user.click(screen.getByText("Open Semester Created PopUp"))
    await user.click(screen.getByRole("button", { name: "Confirm" }))

    expect(onConfirm).toHaveBeenCalled()
  })

  it("should not call onClose when confirm button is clicked", async () => {
    const onClose = vi.fn()
    const { user } = render(<SemesterCreatedPopUpExample {...requiredProps} onClose={onClose} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))
    await user.click(screen.getByRole("button", { name: "Confirm" }))

    expect(onClose).not.toHaveBeenCalled()
  })

  it("should render back button when onBack is provided", async () => {
    const onBack = vi.fn()
    const { user } = render(<SemesterCreatedPopUpExample {...requiredProps} onBack={onBack} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
  })

  it("should not render back button when onBack is not provided", async () => {
    const { user } = render(<SemesterCreatedPopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))

    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument()
  })

  it("should call onBack when back button is clicked", async () => {
    const onBack = vi.fn()
    const { user } = render(<SemesterCreatedPopUpExample {...requiredProps} onBack={onBack} />)
    await user.click(screen.getByText("Open Semester Created PopUp"))
    await user.click(screen.getByRole("button", { name: "Back" }))

    expect(onBack).toHaveBeenCalled()
  })
})
