import type { Meta, StoryObj } from "@storybook/nextjs"
import type { SelectItem } from "@yamada-ui/react"
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

const sampleLocationsAndTimes: SelectItem[] = [
  { label: "Tue | 7:30pm - 10:00pm | UoA Recreation Centre", value: "lr66j8dobrqoodojr460p9jx" },
  { label: "Wed | 5:00pm - 7:00pm | ABA", value: "prfym4c0sz7dcj4v8gmkvg2u" },
  { label: "Thu | 7:30pm - 10:00pm | King's School", value: "34fds8276v9pqgv2w6zpmy4a" },
  { label: "Fri | 7:30pm - 10:00pm | UoA Recreation Centre", value: "smpt3sa8hgwn19osvdf3l3wa" },
  { label: "Sat | 4:00pm - 6:00pm | ABA", value: "o2akj1d225h1fecaydjxze1b" },
]

const samplePlayLevels: SelectItem[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
]

export const Default: Story = {
  args: {
    locationAndTimeOptions: sampleLocationsAndTimes,
    skillLevelOptions: samplePlayLevels,
  },
}
