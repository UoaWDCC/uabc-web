import { render, screen, waitFor } from "@repo/ui/test-utils"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { withNuqsTestingAdapter } from "nuqs/adapters/testing"
import { isValidElement } from "react"
import { useCalendarSelectPopupContext } from "./CalendarSelectPopupContext"
import * as CalendarSelectPopup from "./namespace"

dayjs.extend(utc)
dayjs.extend(timezone)

const NZ_TIMEZONE = "Pacific/Auckland"

describe("<CalendarSelectPopup />", () => {
  it("should be a valid React element", () => {
    expect(isValidElement(<CalendarSelectPopup.Root popupId="test" showTrigger />)).toBe(true)
  })

  it("should have correct displayName", () => {
    expect(CalendarSelectPopup.Root.displayName).toBe("CalendarSelectPopup")
  })

  it("should render with external isOpen prop", () => {
    render(<CalendarSelectPopup.Root isOpen popupId="test" />, {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("should render with custom trigger", () => {
    const CustomTrigger = <button type="button">Custom Trigger</button>
    render(<CalendarSelectPopup.Root popupId="test" showTrigger trigger={CustomTrigger} />, {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(screen.getByRole("button", { name: "Custom Trigger" })).toBeInTheDocument()
  })

  it("should render with custom title and description", () => {
    render(
      <CalendarSelectPopup.Root
        description="Custom description text"
        isOpen
        popupId="test"
        title="Custom Title"
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    expect(screen.getByRole("heading", { name: "Custom Title" })).toBeInTheDocument()
    expect(screen.getByText("Custom description text")).toBeInTheDocument()
  })

  it("should render without close button when allowClose is false", () => {
    render(<CalendarSelectPopup.Root allowClose={false} isOpen popupId="test" />, {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument()
  })

  it("should render with dialog footer", async () => {
    const footer = <div>Custom Footer</div>
    render(<CalendarSelectPopup.Root dialogFooter={footer} isOpen popupId="test" />, {
      wrapper: withNuqsTestingAdapter(),
    })
    expect(
      await screen.findByText((content) => content.includes("Custom Footer")),
    ).toBeInTheDocument()
  })

  it("should handle custom dialog props", () => {
    render(
      <CalendarSelectPopup.Root dialogProps={{ size: "sm", p: "sm" }} isOpen popupId="test" />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("should handle step navigation with closeBehavior close", async () => {
    const onStepChange = vi.fn()
    const { user } = render(
      <CalendarSelectPopup.Root
        closeBehavior="close"
        currentStep={2}
        isOpen
        onStepChange={onStepChange}
        popupId="test"
        totalSteps={3}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    const closeButton = await screen.findByRole("button", { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(onStepChange).toHaveBeenCalledWith(null)
    })
  })

  it("should handle step navigation with closeBehavior back", async () => {
    const onStepChange = vi.fn()
    const { user } = render(
      <CalendarSelectPopup.Root
        closeBehavior="back"
        currentStep={2}
        isOpen
        onStepChange={onStepChange}
        popupId="test"
        totalSteps={3}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    const closeButton = await screen.findByRole("button", { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(onStepChange).toHaveBeenCalledWith(1)
    })
  })

  it("should handle step navigation with closeBehavior back on first step", async () => {
    const onStepChange = vi.fn()
    const { user } = render(
      <CalendarSelectPopup.Root
        closeBehavior="back"
        currentStep={1}
        isOpen
        onStepChange={onStepChange}
        popupId="test"
        totalSteps={3}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    const closeButton = await screen.findByRole("button", { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(onStepChange).toHaveBeenCalledWith(null)
    })
  })

  it("should handle step navigation with closeBehavior custom", async () => {
    const onClose = vi.fn()
    const onStepChange = vi.fn()
    const { user } = render(
      <CalendarSelectPopup.Root
        closeBehavior="custom"
        currentStep={2}
        isOpen
        onClose={onClose}
        onStepChange={onStepChange}
        popupId="test"
        totalSteps={3}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    const closeButton = await screen.findByRole("button", { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
      expect(onStepChange).not.toHaveBeenCalled()
    })
  })

  it("should not close when allowClose is false", () => {
    const onClose = vi.fn()
    render(
      <CalendarSelectPopup.Root allowClose={false} isOpen onClose={onClose} popupId="test" />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument()
  })

  it("should open and close the dialog", async () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    const { user } = render(
      <CalendarSelectPopup.Root onClose={onClose} onOpen={onOpen} popupId="test" showTrigger />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    const trigger = screen.getByRole("button", { name: /open calendar/i })
    await user.click(trigger)

    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(onOpen).toHaveBeenCalled()

    const closeButton = screen.getByRole("button", { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  it("should render calendar with custom props", () => {
    render(
      <CalendarSelectPopup.Root
        calendarProps={{
          size: "sm",
          colorScheme: "secondary",
          type: "date",
        }}
        isOpen
        popupId="test"
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })

  it("should provide context to children", async () => {
    const TestChild = () => {
      const { selectedDate } = useCalendarSelectPopupContext()
      const formattedDate = selectedDate
        ? dayjs(selectedDate as Date)
            .tz(NZ_TIMEZONE)
            .format("ddd MMM DD YYYY")
        : "None"
      return <div>Date: {formattedDate}</div>
    }
    const initialDate = dayjs.tz("2024-01-01", "YYYY-MM-DD", NZ_TIMEZONE).toDate()

    render(
      <CalendarSelectPopup.Root initialDate={initialDate} isOpen popupId="test">
        <TestChild />
      </CalendarSelectPopup.Root>,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    expect(
      screen.getByText((content) => content.startsWith("Date: Mon Jan 01 2024")),
    ).toBeInTheDocument()
  })

  it("should provide null context to children by default", async () => {
    const TestChild = () => {
      const { selectedDate } = useCalendarSelectPopupContext()
      const formattedDate = selectedDate
        ? dayjs(selectedDate as Date)
            .tz(NZ_TIMEZONE)
            .format("ddd MMM DD YYYY")
        : "None"
      return <div>Date: {formattedDate}</div>
    }

    render(
      <CalendarSelectPopup.Root isOpen popupId="test">
        <TestChild />
      </CalendarSelectPopup.Root>,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )
    expect(screen.getByText("Date: None")).toBeInTheDocument()
  })

  it("should select a single date", async () => {
    const onDateSelect = vi.fn()
    const { user } = render(
      <CalendarSelectPopup.Root onDateSelect={onDateSelect} popupId="test" showTrigger />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    await user.click(screen.getByRole("button", { name: /open calendar/i }))

    const today = dayjs().tz(NZ_TIMEZONE).toDate()
    const day = today.getDate()

    const dayButton = screen.getByRole("button", {
      name: new RegExp(`^${day}$`),
    })

    await user.click(dayButton)
    expect(onDateSelect).toHaveBeenCalled()
    const selectedDate = onDateSelect.mock.calls[0][0]
    expect(selectedDate.getDate()).toBe(day)
  })

  it("should select a date range", async () => {
    const onDateSelect = vi.fn()
    const initialDate: [undefined, undefined] = [undefined, undefined]
    const { user } = render(
      <CalendarSelectPopup.Root
        calendarProps={{ enableRange: true }}
        initialDate={initialDate}
        onDateSelect={onDateSelect}
        popupId="test"
        showTrigger
        triggerProps={{
          children: "Custom Trigger",
        }}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    await user.click(screen.getByRole("button", { name: /open calendar/i }))

    const dayButtons = screen.getAllByRole("button", { name: /^\d+$/ })
    await user.click(dayButtons[10])
    await user.click(dayButtons[20])
    expect(onDateSelect).toHaveBeenCalledTimes(2)
    const [start, end] = onDateSelect.mock.calls[1][0]
    expect(start).toBeInstanceOf(Date)
    expect(end).toBeInstanceOf(Date)
    expect(end.getTime()).toBeGreaterThan(start.getTime())
  })

  it("should render custom content", async () => {
    const { user } = render(
      <CalendarSelectPopup.Root popupId="test" showTrigger>
        <CalendarSelectPopup.Content>
          <CalendarSelectPopup.Header title="Custom Header" />
          <CalendarSelectPopup.Body>
            <p>Custom Body</p>
          </CalendarSelectPopup.Body>
        </CalendarSelectPopup.Content>
      </CalendarSelectPopup.Root>,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.queryByText("Custom Body")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /open calendar/i }))

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Custom Header" })).toBeInTheDocument()
      expect(screen.getByText("Custom Body")).toBeInTheDocument()
    })
  })

  it("should render with range calendar and trigger when not open", () => {
    render(
      <CalendarSelectPopup.Root
        calendarProps={{ enableRange: true }}
        initialDate={[
          dayjs.tz("2024-01-01", "YYYY-MM-DD", NZ_TIMEZONE).toDate(),
          dayjs.tz("2024-01-05", "YYYY-MM-DD", NZ_TIMEZONE).toDate(),
        ]}
        isOpen={false}
        popupId="test"
        showTrigger
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    expect(screen.getByRole("button", { name: /open calendar/i })).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("should handle fallback close behavior when back on first step", async () => {
    const onStepChange = vi.fn()
    const { user } = render(
      <CalendarSelectPopup.Root
        closeBehavior="back"
        currentStep={1}
        isOpen
        onStepChange={onStepChange}
        popupId="test"
        totalSteps={3}
      />,
      {
        wrapper: withNuqsTestingAdapter(),
      },
    )

    const closeButton = await screen.findByRole("button", { name: /close/i })
    await user.click(closeButton)

    await waitFor(() => {
      expect(onStepChange).toHaveBeenCalledWith(null)
    })
  })

  it("should use internal close when isOpen is not externally controlled", async () => {
    const { user } = render(<CalendarSelectPopup.Root popupId="test" showTrigger />, {
      wrapper: withNuqsTestingAdapter(),
    })

    await user.click(screen.getByRole("button", { name: /open calendar/i }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /close/i }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })
})
