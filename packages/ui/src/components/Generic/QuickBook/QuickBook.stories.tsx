import { mockSessions } from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
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

export const Default: Story = {
  args: {
    sessions: mockSessions,
  },
}
