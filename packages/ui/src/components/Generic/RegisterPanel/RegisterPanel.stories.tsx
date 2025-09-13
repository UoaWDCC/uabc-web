import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { RegisterPanel } from "./RegisterPanel"

type Story = StoryObj<typeof RegisterPanel>

const meta = {
  title: "Generic Components / RegisterPanel",
  component: RegisterPanel,
  argTypes: {},
} satisfies Meta<typeof RegisterPanel>

export default meta

export const Default: Story = {
  args: {},
}
