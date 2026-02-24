import type { Meta, StoryObj } from "@storybook/react"
import { DateCard } from "./DateCard"

type Story = StoryObj<typeof DateCard>

const meta: Meta<typeof DateCard> = {
  component: DateCard,
  title: "Generic Components/DateCard",
  decorators: [
    (Story) => (
      <div style={{ width: 160 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

export const Empty: Story = {
  args: {
    label: "Start",
  },
}

export const WithDate: Story = {
  args: {
    label: "Start",
    date: new Date(2025, 0, 15),
  },
}

export const EndDate: Story = {
  args: {
    label: "End",
    date: new Date(2025, 3, 30),
  },
}
