import { render, screen, waitFor } from "@repo/ui/test-utils"
import { Button } from "@yamada-ui/react"
import type { ComponentProps } from "react"
import { isValidElement, useState } from "react"
import * as CreateSemesterPopUpFlowModule from "."
import { CreateSemesterPopUpFlow } from "./CreateSemesterPopUpFlow"

const CreateSemesterPopUpFlowExample = (
  props: Omit<ComponentProps<typeof CreateSemesterPopUpFlow>, "open">,
) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Flow</Button>
      <CreateSemesterPopUpFlow onClose={() => setOpen(false)} open={open} {...props} />
    </>
  )
}

const clickCalendarDay = async (user: ReturnType<typeof render>["user"], day: number) => {
  const allButtons = screen.getAllByRole("button")
  const target = allButtons.find(
    (btn) =>
      btn.textContent?.trim() === String(day) &&
      !btn.hasAttribute("disabled") &&
      btn.getAttribute("aria-disabled") !== "true" &&
      !btn.hasAttribute("data-outside"),
  )
  if (!target) {
    throw new Error(`Calendar day button "${day}" not found or is disabled`)
  }
  await user.click(target)
}

const completeNameStep = async (user: ReturnType<typeof render>["user"], name = "Spring 2025") => {
  await user.type(screen.getByPlaceholderText("Enter Semester Name"), name)
  await user.click(screen.getByRole("button", { name: "Next" }))
}

const completeDateStep = async (
  user: ReturnType<typeof render>["user"],
  startDay: number,
  endDay: number,
) => {
  await clickCalendarDay(user, startDay)
  await clickCalendarDay(user, endDay)
  await user.click(await screen.findByRole("button", { name: "Next" }))
}

const completeBookingStep = async (
  user: ReturnType<typeof render>["user"],
  day = "Monday",
  time = "09:00",
) => {
  await waitFor(() => {
    expect(screen.getByRole("combobox", { name: "Select a day" })).toBeInTheDocument()
  })
  await user.click(screen.getByRole("combobox", { name: "Select a day" }))
  await user.click(await screen.findByRole("option", { name: day }))
  await user.type(screen.getByLabelText("Booking Open Time"), time)
  await user.click(screen.getByRole("button", { name: "Next" }))
}

describe("<CreateSemesterPopUpFlow />", () => {
  it("should re-export CreateSemesterPopUpFlow component and check it exists", () => {
    expect(CreateSemesterPopUpFlowModule.CreateSemesterPopUpFlow).toBeDefined()
    expect(
      isValidElement(<CreateSemesterPopUpFlowModule.CreateSemesterPopUpFlow open={false} />),
    ).toBeTruthy()
  })

  it("should have correct displayName", () => {
    expect(CreateSemesterPopUpFlow.displayName).toBe("CreateSemesterPopUpFlow")
  })

  it("should not render when closed", () => {
    render(<CreateSemesterPopUpFlow open={false} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("should start with semester name step", async () => {
    const { user } = render(<CreateSemesterPopUpFlowExample />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    expect(screen.getByRole("heading", { name: "Create New Semester" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Enter Semester Name" })).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter Semester Name")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
  })

  it("should navigate to semester dates step after entering a name", async () => {
    const { user } = render(<CreateSemesterPopUpFlowExample />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await completeNameStep(user, "Spring 2025")

    await waitFor(() => {
      expect(screen.getByText("Semester Dates")).toBeInTheDocument()
    })
    expect(screen.getByText("Spring 2025")).toBeInTheDocument()
    expect(
      screen.getByText("Select the semester start and end dates on the calendar"),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
  })

  it("should navigate back from semester dates step and preserve the entered name", async () => {
    const { user } = render(<CreateSemesterPopUpFlowExample />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await completeNameStep(user, "Spring 2025")

    await waitFor(() => {
      expect(screen.getByText("Semester Dates")).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: "Back" }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter Semester Name")).toBeInTheDocument()
    })
    expect((screen.getByPlaceholderText("Enter Semester Name") as HTMLInputElement).value).toBe(
      "Spring 2025",
    )
  })

  it("should navigate to break dates step after selecting semester dates", async () => {
    const { user } = render(<CreateSemesterPopUpFlowExample />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await completeNameStep(user)

    await waitFor(() => {
      expect(screen.getByText("Semester Dates")).toBeInTheDocument()
    })

    await completeDateStep(user, 5, 25)

    await waitFor(() => {
      expect(screen.getByText(/Semester Break/)).toBeInTheDocument()
    })
    expect(
      screen.getByText("Select the semester break's start and end dates on the calendar"),
    ).toBeInTheDocument()
  })

  it("should navigate to booking settings step after selecting break dates", async () => {
    const { user } = render(<CreateSemesterPopUpFlowExample />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await completeNameStep(user)

    await waitFor(() => {
      expect(screen.getByText("Semester Dates")).toBeInTheDocument()
    })
    await completeDateStep(user, 5, 25)

    await waitFor(() => {
      expect(screen.getByText(/Semester Break/)).toBeInTheDocument()
    })
    await completeDateStep(user, 10, 20)

    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: "Select a day" })).toBeInTheDocument()
    })
    expect(screen.getByLabelText("Booking Open Time")).toBeInTheDocument()
  })

  it("should navigate back from booking settings to break dates step", async () => {
    const { user } = render(<CreateSemesterPopUpFlowExample />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await completeNameStep(user)

    await waitFor(() => {
      expect(screen.getByText("Semester Dates")).toBeInTheDocument()
    })
    await completeDateStep(user, 5, 25)

    await waitFor(() => {
      expect(screen.getByText(/Semester Break/)).toBeInTheDocument()
    })
    await completeDateStep(user, 10, 20)

    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: "Select a day" })).toBeInTheDocument()
    })

    await user.click(screen.getByRole("button", { name: "Back" }))

    await waitFor(() => {
      expect(screen.getByText(/Semester Break/)).toBeInTheDocument()
    })
  }, 10_000)

  it("should show semester creation confirmation popup after completing booking settings", async () => {
    const { user } = render(<CreateSemesterPopUpFlowExample />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await completeNameStep(user, "Spring 2025")

    await waitFor(() => {
      expect(screen.getByText("Semester Dates")).toBeInTheDocument()
    })
    await completeDateStep(user, 5, 25)

    await waitFor(() => {
      expect(screen.getByText(/Semester Break/)).toBeInTheDocument()
    })
    await completeDateStep(user, 10, 20)

    await completeBookingStep(user)

    await waitFor(() => {
      expect(screen.getByText("Semester Creation Confirmation")).toBeInTheDocument()
    })
    expect(screen.getByText("Spring 2025")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
  }, 10_000)

  it("should call onComplete with correct data after confirming", async () => {
    const onComplete = vi.fn()
    const { user } = render(<CreateSemesterPopUpFlowExample onComplete={onComplete} />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await completeNameStep(user, "Spring 2025")

    await waitFor(() => {
      expect(screen.getByText("Semester Dates")).toBeInTheDocument()
    })
    await completeDateStep(user, 5, 25)

    await waitFor(() => {
      expect(screen.getByText(/Semester Break/)).toBeInTheDocument()
    })
    await completeDateStep(user, 10, 20)

    await completeBookingStep(user, "Monday", "09:00")

    await waitFor(() => {
      expect(screen.getByText("Semester Creation Confirmation")).toBeInTheDocument()
    })
    await user.click(screen.getByRole("button", { name: "Confirm" }))

    expect(onComplete).toHaveBeenCalledOnce()
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Spring 2025",
        bookingOpenDay: "monday",
      }),
    )
  }, 10_000)

  it("should handle cancellation from the name step", async () => {
    const onClose = vi.fn()
    const { user } = render(<CreateSemesterPopUpFlowExample onClose={onClose} />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await user.click(screen.getByRole("button", { name: "Cancel" }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it("should handle the close button on any step", async () => {
    const onClose = vi.fn()
    const { user } = render(<CreateSemesterPopUpFlowExample onClose={onClose} />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await user.click(screen.getByLabelText("Close dialog"))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it("should reset to the name step with empty fields when reopened after closing", async () => {
    const { user } = render(<CreateSemesterPopUpFlowExample />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await completeNameStep(user, "Spring 2025")

    await waitFor(() => {
      expect(screen.getByText("Semester Dates")).toBeInTheDocument()
    })

    await user.click(screen.getByLabelText("Close dialog"))

    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter Semester Name")).toBeInTheDocument()
    })
    expect((screen.getByPlaceholderText("Enter Semester Name") as HTMLInputElement).value).toBe("")
  })

  it("should not call onComplete if the flow is closed before confirming", async () => {
    const onComplete = vi.fn()
    const { user } = render(<CreateSemesterPopUpFlowExample onComplete={onComplete} />)
    await user.click(screen.getByRole("button", { name: "Open Flow" }))

    await user.click(screen.getByLabelText("Close dialog"))

    expect(onComplete).not.toHaveBeenCalled()
  })
})
