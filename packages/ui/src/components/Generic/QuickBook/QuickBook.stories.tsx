import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuickBook } from "./QuickBook"

type Story = StoryObj<typeof QuickBook>

const meta = {
  title: "Generic Components / QuickBook",
  component: QuickBook,
  argTypes: {
    title: { control: "text", description: "The component's heading title" },
    submitLabel: { control: "text", description: "The label of the submit button" },
  },
} satisfies Meta<typeof QuickBook>

export default meta

const sampleLocationsAndTimes: { id: string; label: string }[] = [
  { id: "lr66j8dobrqoodojr460p9jx", label: "Tue | 7:30pm - 10:00pm | UOA Recreation Centre" },
  { id: "prfym4c0sz7dcj4v8gmkvg2u", label: "Wed | 5:00pm - 7:00pm | ABA" },
  { id: "34fds8276v9pqgv2w6zpmy4a", label: "Thu | 7:30pm - 10:00pm | King's School" },
  { id: "smpt3sa8hgwn19osvdf3l3wa", label: "Fri | 7:30pm - 10:00pm | UOA Recreation Centre" },
  { id: "o2akj1d225h1fecaydjxze1b", label: "Sat | 4:00pm - 6:00pm | ABA" },
]

export const Default: Story = {
  args: {
    schedules: sampleLocationsAndTimes,
  },
}
