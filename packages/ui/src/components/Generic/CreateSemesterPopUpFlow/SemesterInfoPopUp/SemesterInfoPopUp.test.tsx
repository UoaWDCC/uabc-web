import { Weekday } from "@repo/shared/types"
import { render, screen } from "@repo/ui/test-utils"
import { Button } from "@yamada-ui/react"
import { isValidElement, useState } from "react"
import * as SemesterInfoPopUpModule from "."
import { SemesterInfoPopUp, type SemesterInfoPopUpProps } from "./SemesterInfoPopUp"

const SemesterInfoPopUpExample = (props: Omit<SemesterInfoPopUpProps, "open">) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Booking Settings</Button>
      <SemesterInfoPopUp onClose={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

const customProps = {
  defaultValues: {
    bookingOpenDay: Weekday.monday,
    bookingOpenTime: "12:00",
  },
}

describe("<SemesterInfoPopUp />", () => {
  it("should re-export SemesterInfoPopUp component and check it exists", () => {
    expect(SemesterInfoPopUpModule.SemesterInfoPopUp).toBeDefined()
    expect(isValidElement(<SemesterInfoPopUpModule.SemesterInfoPopUp open={false} />)).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(SemesterInfoPopUp.displayName).toBe("SemesterInfoPopUp")
  })

  it("should render title and form elements", async () => {
    const { user } = render(<SemesterInfoPopUpExample />)
    await user.click(screen.getByText("Open Booking Settings"))

    expect(screen.getByText("Create New Semester")).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Select a day" })).toBeInTheDocument()
    expect(screen.getByLabelText("Booking Open Time")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
    expect(screen.getByLabelText("Close dialog")).toBeInTheDocument()
  })

  it("should render with default values", async () => {
    const { user } = render(<SemesterInfoPopUpExample {...customProps} />)
    await user.click(screen.getByText("Open Booking Settings"))

    const timeInput = screen.getByLabelText("Booking Open Time") as HTMLInputElement
    expect(timeInput.value).toBe("12:00")
  })

  it("should render all weekday options", async () => {
    const { user } = render(<SemesterInfoPopUpExample />)
    await user.click(screen.getByText("Open Booking Settings"))

    const select = screen.getByRole("combobox", { name: "Select a day" })
    await user.click(select)

    expect(screen.getByText("Sunday")).toBeInTheDocument()
    expect(screen.getByText("Monday")).toBeInTheDocument()
    expect(screen.getByText("Tuesday")).toBeInTheDocument()
    expect(screen.getByText("Wednesday")).toBeInTheDocument()
    expect(screen.getByText("Thursday")).toBeInTheDocument()
    expect(screen.getByText("Friday")).toBeInTheDocument()
    expect(screen.getByText("Saturday")).toBeInTheDocument()
  })

  it("should handle form submission with valid data", async () => {
    const onNext = vi.fn()
    const { user } = render(<SemesterInfoPopUpExample onNext={onNext} />)
    await user.click(screen.getByText("Open Booking Settings"))

    const select = screen.getByRole("combobox", { name: "Select a day" })
    await user.click(select)
    await user.click(screen.getByText("Monday"))

    const timeInput = screen.getByLabelText("Booking Open Time")
    await user.type(timeInput, "12:00")

    await user.click(screen.getByRole("button", { name: "Next" }))

    expect(onNext).toHaveBeenCalledWith(
      { bookingOpenDay: "monday", bookingOpenTime: "12:00" },
      expect.any(Object),
    )
  })

  it("should show validation error when submitting without selecting a day", async () => {
    const onNext = vi.fn()
    const { user } = render(<SemesterInfoPopUpExample onNext={onNext} />)
    await user.click(screen.getByText("Open Booking Settings"))

    await user.click(screen.getByRole("button", { name: "Next" }))

    expect(onNext).not.toHaveBeenCalled()
    expect(screen.getByText("Please select a day")).toBeInTheDocument()
  })

  it("should show validation error when submitting without a time", async () => {
    const onNext = vi.fn()
    const { user } = render(<SemesterInfoPopUpExample onNext={onNext} />)
    await user.click(screen.getByText("Open Booking Settings"))

    const select = screen.getByRole("combobox", { name: "Select a day" })
    await user.click(select)
    await user.click(screen.getByText("Monday"))

    await user.click(screen.getByRole("button", { name: "Next" }))

    expect(onNext).not.toHaveBeenCalled()
    expect(screen.getByText("Invalid time format (HH:mm)")).toBeInTheDocument()
  })

  it("should handle back button click", async () => {
    const onBack = vi.fn()
    const { user } = render(<SemesterInfoPopUpExample onBack={onBack} />)
    await user.click(screen.getByText("Open Booking Settings"))

    await user.click(screen.getByRole("button", { name: "Back" }))

    expect(onBack).toHaveBeenCalled()
  })

  it("should handle close button click", async () => {
    const onClose = vi.fn()
    const { user } = render(<SemesterInfoPopUpExample onClose={onClose} />)
    await user.click(screen.getByText("Open Booking Settings"))

    await user.click(screen.getByLabelText("Close dialog"))

    expect(onClose).toHaveBeenCalled()
  })
})
