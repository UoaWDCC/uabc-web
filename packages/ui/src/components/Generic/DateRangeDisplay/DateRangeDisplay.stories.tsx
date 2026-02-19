import type { Meta, StoryObj } from "@storybook/react"
import { DateRangeDisplay } from "./DateRangeDisplay"

type Story = StoryObj<typeof DateRangeDisplay>

const meta: Meta<typeof DateRangeDisplay> = {
  component: DateRangeDisplay,
  title: "Generic Components/DateRangeDisplay",
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

export const Empty: Story = {
  args: {},
}

export const WithStartDateOnly: Story = {
  args: {
    startDate: new Date(2025, 0, 15),
  },
}

export const WithBothDates: Story = {
  args: {
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 3, 30),
  },
}
