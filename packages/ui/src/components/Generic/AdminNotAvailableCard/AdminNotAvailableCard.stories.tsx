import type { Meta, StoryObj } from "@storybook/react"
import { AdminNotAvailableCard } from "./AdminNotAvailableCard"

const meta: Meta<typeof AdminNotAvailableCard> = {
  title: "Generic Components / AdminNotAvailableCard",
  component: AdminNotAvailableCard,
}
export default meta

type Story = StoryObj<typeof AdminNotAvailableCard>

export const Default: Story = {}
