import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { useForm } from "react-hook-form"
import { BookingTimesCardGroup } from "./BookingTimesCardGroup"

const meta: Meta<typeof BookingTimesCardGroup> = {
  title: "Generic Components / BookingTimesCardGroup",
  component: BookingTimesCardGroup,
}

export default meta

type Story = StoryFn<typeof BookingTimesCardGroup>

const defaultData = [
  {
    addon: "UoA Hiwa Center",
    memberAttendees: "32/35",
    casualAttendees: "4/5",
    description: "19:30 - 20:00",
    label: "Tuesday, 12th May",
    value: "1",
  },
  {
    addon: "UoA Hiwa Center",
    memberAttendees: "32/35",
    casualAttendees: "4/5",
    description: "19:30 - 20:00",
    label: "Tuesday, 12th May",
    value: "2",
  },
  {
    addon: "UoA Hiwa Center",
    memberAttendees: "32/35",
    casualAttendees: "4/5",
    description: "19:30 - 20:00",
    label: "Tuesday, 12th May",
    value: "3",
  },
]

export const TypesAndStates: Story = (_args) => {
  const { control } = useForm<{
    bookingTimes: string
  }>()

  const states = ["normal", "disabled", "error", "checked"]

  return (
    <PropsTable rows={states} variant="column">
      {(_col, row, _index) => {
        const isDisabled = row === "disabled"
        const isError = row === "error"
        const isChecked = row === "checked"

        const items = defaultData.map((item) => ({
          ...item,
          value: `${item.value}-${row}`,
          invalid: isError,
          disabled: isDisabled,
          checked: isChecked ? true : undefined,
        }))

        return <BookingTimesCardGroup control={control} items={items} name="bookingTimes" />
      }}
    </PropsTable>
  )
}
