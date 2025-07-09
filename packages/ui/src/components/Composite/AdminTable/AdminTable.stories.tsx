import type { Meta, StoryObj } from "@storybook/react"
import { NuqsAdapter } from "nuqs/adapters/react"
import { AdminMembers } from "./index"

const meta: Meta<typeof AdminMembers> = {
  title: "Composite Components / AdminTable",
  component: AdminMembers,
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const AdminTable: Story = {}
