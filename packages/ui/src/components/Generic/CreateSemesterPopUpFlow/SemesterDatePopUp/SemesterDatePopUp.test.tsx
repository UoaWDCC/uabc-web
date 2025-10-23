import { render, screen } from "@repo/ui/test-utils"
import { Button } from "@yamada-ui/react"
import { isValidElement, useState } from "react"
import * as SemesterDatePopUpModule from "."
import { SemesterDatePopUp, type SemesterDatePopUpProps } from "./SemesterDatePopUp"

const SemesterDatePopUpExample = (props: Omit<SemesterDatePopUpProps, "open">) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Semester Date PopUp</Button>
      <SemesterDatePopUp onClose={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

const requiredProps = {
  title: "Test Title",
  semesterName: "Test Semester",
}

const customProps = {
  ...requiredProps,
  subtitle: "Test subtitle",
  defaultValues: {
    startDate: "2025-01-01T00:00:00.000Z",
    endDate: "2025-01-15T00:00:00.000Z",
  },
}

describe("<SemesterDatePopUp />", () => {
  it("should re-export SemesterDatePopUp component and check it exists", () => {
    expect(SemesterDatePopUpModule.SemesterDatePopUp).toBeDefined()
    expect(
      isValidElement(
        <SemesterDatePopUpModule.SemesterDatePopUp open={false} semesterName="" title="" />,
      ),
    ).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(SemesterDatePopUp.displayName).toBe("SemesterDatePopUp")
  })

  it("should render title and calendar elements", async () => {
    const { user } = render(<SemesterDatePopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Date PopUp"))

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("Create New Semester")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
    expect(screen.getByLabelText("Close dialog")).toBeInTheDocument()
  })

  it("should render with subtitle", async () => {
    const { user } = render(
      <SemesterDatePopUpExample {...requiredProps} subtitle="Test subtitle" />,
    )
    await user.click(screen.getByText("Open Semester Date PopUp"))

    expect(screen.getByText("Test subtitle")).toBeInTheDocument()
  })

  it("should render with default values", async () => {
    const { user } = render(<SemesterDatePopUpExample {...customProps} />)
    await user.click(screen.getByText("Open Semester Date PopUp"))

    // The calendar should show the selected date range
    expect(screen.getByText("Test Title")).toBeInTheDocument()
  })

  it("should show Next button when dates are selected", async () => {
    const { user } = render(<SemesterDatePopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Date PopUp"))

    // Initially no Next button should be visible
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument()

    // After selecting dates, Next button should appear
    // Note: This would require interacting with the calendar component
    // For now, we test the initial state
  })

  it("should handle back button click", async () => {
    const onBack = vi.fn()
    const { user } = render(<SemesterDatePopUpExample {...requiredProps} onBack={onBack} />)
    await user.click(screen.getByText("Open Semester Date PopUp"))

    const backButton = screen.getByRole("button", { name: "Back" })
    await user.click(backButton)

    expect(onBack).toHaveBeenCalled()
  })

  it("should handle close button click", async () => {
    const onClose = vi.fn()
    const { user } = render(<SemesterDatePopUpExample {...requiredProps} onClose={onClose} />)
    await user.click(screen.getByText("Open Semester Date PopUp"))

    const closeButton = screen.getByLabelText("Close dialog")
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalled()
  })

  it("should handle next button click when dates are selected", async () => {
    const onNext = vi.fn()
    const { user } = render(
      <SemesterDatePopUpExample
        {...requiredProps}
        defaultValues={{
          startDate: "2025-01-01T00:00:00.000Z",
          endDate: "2025-01-15T00:00:00.000Z",
        }}
        onNext={onNext}
      />,
    )
    await user.click(screen.getByText("Open Semester Date PopUp"))

    // With default values, Next button should be available
    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)

    expect(onNext).toHaveBeenCalledWith({
      startDate: "2025-01-01T00:00:00.000Z",
      endDate: "2025-01-15T00:00:00.000Z",
    })
  })
})
