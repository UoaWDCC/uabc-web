import { render, screen } from "@repo/ui/test-utils"
import { forwardRef } from "react"
import { useForm } from "react-hook-form"
import { BookingTimesCardGroup } from "./BookingTimesCardGroup"

const bookingTimesItems = [
  {
    label: "Tuesday, 12th May",
    value: "booking-123",
    addon: "UoA Hiwa Center",
    description: "7:30 - 10pm",
  },
  {
    label: "Wednesday, 13th May",
    value: "booking-456",
    addon: "Cool Center",
    description: "2:00 - 4:30pm",
    disabled: true,
  },
]

function renderWithForm(props: Partial<React.ComponentProps<typeof BookingTimesCardGroup>> = {}) {
  // Wrap in a component to provide react-hook-form context
  const Wrapper = forwardRef<HTMLDivElement>((_, ref) => {
    const { control, handleSubmit, formState } = useForm({
      defaultValues: {
        bookingTimes: [],
      },
      mode: "onChange",
    })

    return (
      <form onSubmit={handleSubmit(() => {})}>
        <BookingTimesCardGroup
          control={control}
          errorMessage={formState.errors.bookingTimes?.message}
          isError={!!formState.errors.bookingTimes}
          items={bookingTimesItems}
          name="bookingTimes"
          ref={ref}
          {...props}
        />
        <button type="submit">Submit</button>
      </form>
    )
  })
  return render(<Wrapper />)
}

describe("<BookingTimesCardGroup />", () => {
  it("should have correct displayName", () => {
    expect(BookingTimesCardGroup.displayName).toBe("BookingTimesCardGroup")
  })

  it("renders all booking time cards", () => {
    renderWithForm()
    expect(screen.getByText("Tuesday, 12th May")).toBeInTheDocument()
    expect(screen.getByText("Wednesday, 13th May")).toBeInTheDocument()
    expect(screen.getByText("UoA Hiwa Center")).toBeInTheDocument()
    expect(screen.getByText("Cool Center")).toBeInTheDocument()
    expect(screen.getByText("7:30 - 10pm")).toBeInTheDocument()
    expect(screen.getByText("2:00 - 4:30pm")).toBeInTheDocument()
  })

  it("renders disabled state for disabled items", () => {
    renderWithForm()

    const disabledCard = screen.getByText("Wednesday, 13th May").closest("label")
    expect(disabledCard).toHaveAttribute("aria-disabled", "true")
  })
})
