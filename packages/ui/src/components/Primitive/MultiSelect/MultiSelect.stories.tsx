import type { Meta, StoryFn } from "@storybook/react"
import { CalendarClockIcon } from "@yamada-ui/lucide"
import { Option } from "@yamada-ui/react"
import { MultiSelect } from "./MultiSelect"

type Story = StoryFn<typeof MultiSelect>

const meta: Meta<typeof MultiSelect> = {
  component: MultiSelect,
  title: "Primitive Components / MultiSelect",
  argTypes: {
    label: {
      control: { type: "text" },
      description: "The label text of the MultiSelect component",
      table: {
        type: { summary: "string" },
      },
    },
  },
}

export default meta

export const Basic: Story = (args) => {
  return (
    <MultiSelect {...args} icon={<CalendarClockIcon fontSize={24} />}>
      <Option value="1">Option 1</Option>
      <Option value="2">Option 2</Option>
      <Option value="3">Option 3</Option>
    </MultiSelect>
  )
}

export const Stylised: Story = (args) => {
  return (
    <MultiSelect {...args} icon={<CalendarClockIcon fontSize={24} />} stylised>
      <Option value="1">Option 1</Option>
      <Option value="2">Option 2</Option>
      <Option value="3">Option 3</Option>
    </MultiSelect>
  )
}
