import type { Meta, StoryFn } from "@storybook/react"
import { CalendarClockIcon } from "@yamada-ui/lucide"
import { Option } from "@yamada-ui/react"
import { MobileSingleSelect } from "./MobileSingleSelect"

type Story = StoryFn<typeof MobileSingleSelect>

const meta: Meta<typeof MobileSingleSelect> = {
  component: MobileSingleSelect,
  title: "Primitive Components / Select",
  argTypes: {
    label: {
      control: { type: "text" },
      description: "The label text of the Select component",
      table: {
        type: { summary: "string" },
      },
    },
  },
}

export default meta

export const Basic: Story = (args) => {
  return (
    <MobileSingleSelect {...args} icon={<CalendarClockIcon fontSize={24} />}>
      <Option value="1">Option 1</Option>
      <Option value="2">Option 2</Option>
      <Option value="3">Option 3</Option>
    </MobileSingleSelect>
  )
}
