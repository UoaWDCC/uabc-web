import type { Meta, StoryObj } from "@storybook/nextjs"
import { LoginPanel } from "./LoginPanel"

type Story = StoryObj<typeof LoginPanel>

const meta = {
  title: "Generic Components / LoginPanel",
  component: LoginPanel,
  argTypes: {},
} satisfies Meta<typeof LoginPanel>

export default meta

export const Default: Story = {
  args: {},
}
