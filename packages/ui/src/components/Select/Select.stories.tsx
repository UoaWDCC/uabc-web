import type { Meta, StoryObj } from "@storybook/react"
import { Option } from "@yamada-ui/react"
import { Select } from "./Select"

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
}

export default meta

type Story = StoryObj<typeof Select>

export const Basic: Story = {
  render: (args) => (
    <Select {...args}>
      <Option value="孫悟空">孫悟空</Option>
      <Option value="ベジータ">ベジータ</Option>
      <Option value="フリーザ">フリーザ</Option>
    </Select>
  ),
}
