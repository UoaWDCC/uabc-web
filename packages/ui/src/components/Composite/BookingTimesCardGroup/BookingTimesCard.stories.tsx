import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { BookingTimesCardGroup } from "./BookingTimesCardGroup"

const meta: Meta<typeof BookingTimesCardGroup> = {
  title: "Composite Components / BookingTimesCardGroup",
  component: BookingTimesCardGroup,
}

export default meta

type Story = StoryFn<typeof BookingTimesCardGroup>

const defaultData = [
  {
    location: "UoA Hiwa Center",
    bookingTime: "19:30 - 20:00",
    label: "Tuesday, 12th May",
    value: "1",
  },
  {
    location: "UoA Hiwa Center",
    bookingTime: "19:30 - 20:00",
    label: "Tuesday, 12th May",
    value: "2",
  },
  {
    location: "UoA Hiwa Center",
    bookingTime: "19:30 - 20:00",
    label: "Tuesday, 12th May",
    value: "3",
  },
]

export const TypesAndStates: Story = (_args) => {
  const states = ["normal", "disabled", "error"]

  return (
    <PropsTable rows={states} variant="column">
      {(_col, row, _index) => {
        const isDisabled = row === "disabled"
        const isError = row === "error"

        const items = defaultData.map((item) => ({
          ...item,
          invalid: isError,
          full: isDisabled,
        }))

        return <BookingTimesCardGroup defaultValue={["1"]} items={items} />
      }}
    </PropsTable>
  )
}
