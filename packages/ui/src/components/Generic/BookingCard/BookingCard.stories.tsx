import type { Meta, StoryFn } from "@storybook/nextjs-vite"
import { BookingCard } from "./BookingCard"

const meta: Meta<typeof BookingCard> = {
  title: "Generic Components/BookingCard",
  component: BookingCard,
  argTypes: {
    day: { control: "text", description: "Day of the week" },
    location: { control: "text", description: "Venue name" },
    address: { control: "text", description: "Venue address" },
    startTime: { control: "text", description: "Start time" },
    endTime: { control: "text", description: "End time" },
    imageProps: { control: "object", description: "Image props" },
    menuItems: { control: "object", description: "Menu items for the three-dot menu" },
  },
  args: {
    day: "Saturday",
    location: "Auckland Badminton Stadium",
    address: "99 Gillies Ave",
    startTime: "7:30 PM",
    endTime: "10:00 PM",
    imageProps: {
      src: "https://placehold.co/100x100",
      alt: "Badminton court",
      width: 300,
      height: 200,
    },
    menuItems: [
      { label: "Edit", onClick: () => alert("Edit clicked"), color: "primary" },
      { label: "Delete", onClick: () => alert("Delete clicked"), color: "danger" },
    ],
  },
}

export default meta

type Story = StoryFn<typeof BookingCard>

export const Basic: Story = (args) => <BookingCard {...args} />
