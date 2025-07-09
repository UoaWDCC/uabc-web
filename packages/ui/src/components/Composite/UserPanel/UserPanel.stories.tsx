import type { Meta, StoryObj } from "@storybook/react"
import { UserPanel } from "./UserPanel"

const meta: Meta<typeof UserPanel> = {
  title: "Composite Components / UserPanel",
  component: UserPanel,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    status: {
      control: { type: "select" },
      options: ["Member", "Casual"],
    },
    sessionsLeft: {
      control: { type: "number", min: 0 },
    },
    name: {
      control: { type: "text" },
    },
    email: {
      control: { type: "text" },
    },
    phone: {
      control: { type: "text" },
    },
    avatarSrc: {
      control: { type: "text" },
    },
  },
}

export default meta
type Story = StoryObj<typeof UserPanel>

export const Default: Story = {
  args: {
    name: "Stitch Pelekai",
    status: "Member",
    email: "spel626@aucklanduni.ac.nz",
    phone: "021 234 5678",
    sessionsLeft: 7,
  },
}

export const Member: Story = {
  args: {
    name: "Stitch Pelekai",
    status: "Member",
    email: "spel626@aucklanduni.ac.nz",
    phone: "021 234 5678",
    sessionsLeft: 7,
  },
}

export const Casual: Story = {
  args: {
    name: "Stitch Pelekai",
    status: "Casual",
    email: "spel626@aucklanduni.ac.nz",
    phone: "021 234 5678",
    sessionsLeft: 0,
  },
}
