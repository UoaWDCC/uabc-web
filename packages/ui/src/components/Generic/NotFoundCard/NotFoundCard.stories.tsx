import type { Meta, StoryObj } from "@storybook/react"
import { NotFoundCard } from "./NotFoundCard"

const meta: Meta<typeof NotFoundCard> = {
  title: "Generic Components / NotFoundCard",
  component: NotFoundCard,
}
export default meta

type Story = StoryObj<typeof NotFoundCard>

export const Default: Story = {}
