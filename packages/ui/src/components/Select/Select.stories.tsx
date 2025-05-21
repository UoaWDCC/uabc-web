import type { Meta, StoryObj } from "@storybook/react"
import { CalendarClockIcon } from "@yamada-ui/lucide"
import { Option } from "@yamada-ui/react"
import { Select } from "./Select"

const meta: Meta<typeof Select> = {
  component: Select,
  title: "Components  / Select",
  argTypes: {
    placeholder: {
      control: { type: "text" },
      description: "The placeholder content of the Select component",
      table: {
        type: { summary: "string" },
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const Basic: Story = {
  render: (args) => (
    <Select {...args} icon={<CalendarClockIcon fontSize={24} />} label="Skill Level">
      <Option value="Beginner">Beginner</Option>
      <Option value="Intermediate">Intermediate</Option>
      <Option value="Advanced">Advanced</Option>
    </Select>
  ),
}
