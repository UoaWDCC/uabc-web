import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
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

export const NoIcon: Story = (args) => {
  return (
    <MultiSelect {...args}>
      <Option value="1">Option 1</Option>
      <Option value="2">Option 2</Option>
      <Option value="3">Option 3</Option>
    </MultiSelect>
  )
}

export const TypesAndStates: Story = (args) => {
  const states = ["normal", "disabled", "error"]
  const types = ["unstylised", "stylised"]
  return (
    <PropsTable columns={states} rows={types}>
      {(column, row, key) => {
        const isDisabled = column === "disabled"
        const isError = column === "error"
        const stylised = row === "stylised"

        return (
          <MultiSelect
            {...args}
            disabled={isDisabled}
            formControlProps={{
              disabled: isDisabled,
              errorMessage: isError ? "This field has an error" : undefined,
              invalid: isError,
            }}
            icon={<CalendarClockIcon fontSize={24} />}
            key={key}
            stylised={stylised}
          >
            <Option value="1">Option 1</Option>
            <Option value="2">Option 2</Option>
            <Option value="3">Option 3</Option>
          </MultiSelect>
        )
      }}
    </PropsTable>
  )
}
