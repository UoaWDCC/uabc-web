import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuickBook } from "./QuickBook"

const meta: Meta<typeof QuickBook> = {
  title: "Generic Components / QuickBook",
  component: QuickBook,
  argTypes: {
    title: { control: "text", description: "The components heading title" },
  },
}

export default meta
type Story = StoryObj<typeof QuickBook>

export const Default: Story = {
  args: {
    title: "Quick Book",
  },
}
