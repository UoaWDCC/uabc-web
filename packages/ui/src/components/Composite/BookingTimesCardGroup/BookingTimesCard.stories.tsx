import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { BookingTimesCardGroup } from "./BookingTimesCardGroup"

const meta: Meta<typeof BookingTimesCardGroup> = {
  title: "Composite Components / BookingTimesCardGroup",
  component: BookingTimesCardGroup,
  argTypes: {
    // label: {
    //   control: "text",
    //   description: "The component's heading title label",
    //   table: {
    //     type: { summary: "string" },
    //     defaultValue: { summary: "Tuesday, 12th May" },
    //   },
    // },
    // value: {
    //   control: "text",
    //   description: "The component's value",
    //   table: {
    //     type: { summary: "string" },
    //     defaultValue: { summary: "e7f2ge97g2fu9beu2ge97gfu9i2heb" },
    //   },
    // },
    // location: {
    //   control: "text",
    //   description: "The component's location",
    //   table: {
    //     type: { summary: "string" },
    //     defaultValue: { summary: "UoA Hiwa Center" },
    //   },
    // },
    // bookingTime: {
    //   control: "text",
    //   description: "The component's booking time",
    //   table: {
    //     type: { summary: "string" },
    //     defaultValue: { summary: "7:30 - 10pm" },
    //   },
    // },
    // full: {
    //   control: "boolean",
    //   description: "Whether the component is full",
    //   table: {
    //     type: { summary: "boolean" },
    //     defaultValue: { summary: "false" },
    //   },
    // },
  },
}

export default meta

type Story = StoryFn<typeof BookingTimesCardGroup>

export const TypesAndStates: Story = (_args) => {
  const states = ["normal", "disabled", "error"]

  const data = [
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

  return (
    <PropsTable rows={states} variant="column">
      {(_col, row, _index) => {
        // Determine state
        const isDisabled = row === "disabled"
        const isError = row === "error"

        // Map data to BookingTimesCardProps
        const items = data.map((item) => ({
          ...item,
          invalid: isError,
          disabled: isDisabled,
        }))

        return <BookingTimesCardGroup defaultValue={["1"]} items={items} />
      }}
    </PropsTable>
  )
}
