import type { Meta, StoryObj } from "@storybook/react"
import { RegisterFlow } from "./RegisterFlow"
import { RegisterFlowSkeleton } from "./RegisterFlowSkeleton"

const meta = {
  title: "Generic Components / RegisterFlow",
  component: RegisterFlow,
} satisfies Meta<typeof RegisterFlow>

export default meta
type Story = StoryObj<typeof RegisterFlow>

export const Default: Story = {}

export const Skeleton: Story = {
  render: () => <RegisterFlowSkeleton />,
}
