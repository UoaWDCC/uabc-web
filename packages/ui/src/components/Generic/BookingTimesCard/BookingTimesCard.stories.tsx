import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { CheckboxCardGroup } from "@yamada-ui/react"
import { BookingTimesCard } from "./BookingTimesCard"

const meta: Meta<typeof BookingTimesCard> = {
  title: "Generic Components / BookingTimesCard",
  component: BookingTimesCard,
  argTypes: {
    label: {
      control: "text",
      description: "The component's heading title label",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Tuesday, 12th May" },
      },
    },
    value: {
      control: "text",
      description: "The component's value",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "e7f2ge97g2fu9beu2ge97gfu9i2heb" },
      },
    },
    location: {
      control: "text",
      description: "The component's location",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "UoA Hiwa Center" },
      },
    },
    bookingTime: {
      control: "text",
      description: "The component's booking time",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "7:30 - 10pm" },
      },
    },
  },
}

export default meta

type Story = StoryFn<typeof BookingTimesCard>

export const Default: Story = (args) => {
  return (
    <CheckboxCardGroup>
      <BookingTimesCard
        {...args}
        bookingTime="7:30 - 10pm"
        label="Tuesday, 12th May"
        location="UoA Hiwa Center"
        onClick={() => console.log("Button clicked")}
      />
    </CheckboxCardGroup>
  )
}

export const Disabled: Story = (args) => {
  return (
    <PropsTable columns={["Disabled"]} rows={["true", "false"]}>
      {(_column, row, key) => {
        return (
          <CheckboxCardGroup>
            <BookingTimesCard
              {...args}
              bookingTime="7:30 - 10pm"
              full={row === "true"}
              key={key}
              label="Tuesday, 12th May"
              location="UoA Hiwa Center"
              onClick={() => console.log("Button clicked")}
            />
          </CheckboxCardGroup>
        )
      }}
    </PropsTable>
  )
}
