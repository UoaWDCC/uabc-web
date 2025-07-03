import type { Meta, StoryFn } from "@storybook/nextjs"
import { PropsTable } from "@storybook-config/components"
import { BookingTimesCard } from "./BookingTimesCard"
import { BOOKING_TIMES_CARD_TYPES } from "./BookingTimesCard.style"

const meta: Meta<typeof BookingTimesCard> = {
  title: "Composite Components / BookingTimesCard",
  component: BookingTimesCard,
  argTypes: {
    title: {
      control: "text",
      description: "The components heading title",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Tuesday, 12th May" },
      },
    },
    bookingTime: {
      control: "text",
      description: "The components booking time",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "7:30 - 10pm" },
      },
    },
    location: {
      control: "text",
      description: "The components location",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "UoA Hiwa Center" },
      },
    },
    type: {
      control: "select",
      options: ["default", "selected", "full"],
      description: "The components type",
      table: {
        type: { summary: '"default" | "selected" | "full"' },
        defaultValue: { summary: "default" },
      },
    },
  },
}

export default meta

type Story = StoryFn<typeof BookingTimesCard>

export const Default: Story = (args) => {
  return (
    <BookingTimesCard
      {...args}
      bookingTime="7:30 - 10pm"
      location="UoA Hiwa Center"
      title="Tuesday, 12th May"
    />
  )
}

export const Types: Story = (args) => {
  return (
    <PropsTable columns={["Types"]} rows={BOOKING_TIMES_CARD_TYPES}>
      {(_col, row, key) => {
        return (
          <BookingTimesCard
            key={key}
            {...args}
            bookingTime="7:30 - 10pm"
            location="UoA Hiwa Center"
            title="Tuesday, 12th May"
            type={row}
          />
        )
      }}
    </PropsTable>
  )
}
