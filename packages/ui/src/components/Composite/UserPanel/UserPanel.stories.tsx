import { adminUserMock, casualUserMock, memberUserMock } from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/react"
import { UserPanel } from "./UserPanel"

const meta: Meta<typeof UserPanel> = {
  title: "Composite Components / UserPanel",
  component: UserPanel,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    user: {
      control: { type: "object" },
    },
    iconButtonProps: {
      control: { type: "object" },
    },
  },
}

export default meta
type Story = StoryObj<typeof UserPanel>

export const Default: Story = {
  args: {
    user: memberUserMock,
  },
}

export const Member: Story = {
  args: {
    user: memberUserMock,
  },
}

export const Casual: Story = {
  args: {
    user: casualUserMock,
  },
}

export const Admin: Story = {
  args: {
    user: adminUserMock,
  },
}
