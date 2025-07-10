import type { Meta, StoryObj } from "@storybook/nextjs"
import { AdminTabBar } from "./AdminTabBar"

type Story = StoryObj<typeof AdminTabBar>

const meta = {
  title: "Generic Components / AdminTabBar",
  component: AdminTabBar,
  argTypes: {},
} satisfies Meta<typeof AdminTabBar>

export default meta

export const Default: Story = {
  args: {},
}
