import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuickBook } from "./QuickBook"
import { locationsAndTimeMock, playLevelMock } from "./QuickBook.mock"

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

export const Default: Story = {
  args: {
    locationAndTimeOptions: locationsAndTimeMock,
    skillLevelOptions: playLevelMock,
  },
}
