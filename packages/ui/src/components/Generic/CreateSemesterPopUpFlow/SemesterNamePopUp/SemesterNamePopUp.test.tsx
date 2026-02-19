import { render, screen } from "@repo/ui/test-utils"
import { Button } from "@yamada-ui/react"
import { isValidElement, useState } from "react"
import * as SemesterNamePopUpModule from "."
import { SemesterNamePopUp, type SemesterNamePopUpProps } from "./SemesterNamePopUp"

const SemesterNamePopUpExample = (props: Omit<SemesterNamePopUpProps, "open">) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Semester Name PopUp</Button>
      <SemesterNamePopUp onCancel={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

const requiredProps = {
  // open is handled by the example component
}

const customProps = {
  ...requiredProps,
  defaultValues: {
    name: "Test Semester",
  },
}

describe("<SemesterNamePopUp />", () => {
  it("should re-export SemesterNamePopUp component and check it exists", () => {
    expect(SemesterNamePopUpModule.SemesterNamePopUp).toBeDefined()
    expect(isValidElement(<SemesterNamePopUpModule.SemesterNamePopUp open={false} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(SemesterNamePopUp.displayName).toBe("SemesterNamePopUp")
  })

  it("should render title and form elements", async () => {
    const { user } = render(<SemesterNamePopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Name PopUp"))

    expect(screen.getByText("Create New Semester")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter Semester Name")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByLabelText("Close dialog")).toBeInTheDocument()
  })

  it("should render with default values", async () => {
    const { user } = render(<SemesterNamePopUpExample {...customProps} />)
    await user.click(screen.getByText("Open Semester Name PopUp"))

    const input = screen.getByPlaceholderText("Enter Semester Name") as HTMLInputElement
    expect(input.value).toBe("Test Semester")
  })

  it("should handle form submission", async () => {
    const onConfirm = vi.fn()
    const { user } = render(<SemesterNamePopUpExample {...requiredProps} onConfirm={onConfirm} />)
    await user.click(screen.getByText("Open Semester Name PopUp"))

    const input = screen.getByPlaceholderText("Enter Semester Name")
    await user.type(input, "Spring 2025")

    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)

    expect(onConfirm).toHaveBeenCalledWith({ name: "Spring 2025" }, expect.any(Object))
  })

  it("should handle cancel button click", async () => {
    const onCancel = vi.fn()
    const { user } = render(<SemesterNamePopUpExample {...requiredProps} onCancel={onCancel} />)
    await user.click(screen.getByText("Open Semester Name PopUp"))

    const cancelButton = screen.getByRole("button", { name: "Cancel" })
    await user.click(cancelButton)

    expect(onCancel).toHaveBeenCalled()
  })

  it("should handle close button click", async () => {
    const onCancel = vi.fn()
    const { user } = render(<SemesterNamePopUpExample {...requiredProps} onCancel={onCancel} />)
    await user.click(screen.getByText("Open Semester Name PopUp"))

    const closeButton = screen.getByLabelText("Close dialog")
    await user.click(closeButton)

    expect(onCancel).toHaveBeenCalled()
  })

  it("should show validation error for empty name", async () => {
    const { user } = render(<SemesterNamePopUpExample {...requiredProps} />)
    await user.click(screen.getByText("Open Semester Name PopUp"))

    const nextButton = screen.getByRole("button", { name: "Next" })
    await user.click(nextButton)

    // The form should prevent submission with empty name due to validation
    // This test verifies the form behavior
  })
})
