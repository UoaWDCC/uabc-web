import type { Meta, StoryObj } from "@storybook/react"
import { BookACourt } from "./BookACourt"

const meta: Meta<typeof BookACourt> = {
  title: "Generic Components / BookACourt",
  component: BookACourt,
}
export default meta

type Story = StoryObj<typeof BookACourt>

export const Default: Story = {}
