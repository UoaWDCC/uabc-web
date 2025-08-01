import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { CalendarClockIcon } from "@yamada-ui/lucide"
import { FormControl, Option } from "@yamada-ui/react"
import { Select } from "./Select"

type Story = StoryFn<typeof Select>

const meta: Meta<typeof Select> = {
  component: Select,
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

export const Basic: Story = ({ label, ...args }) => {
  const labelStr = label?.length ? label : "Select option"
  return (
    <FormControl label={labelStr}>
      <Select label={labelStr} {...args} icon={<CalendarClockIcon fontSize={24} />}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </Select>
    </FormControl>
  )
}

export const Stylised: Story = ({ label, ...args }) => {
  const labelStr = label?.length ? label : "Select option"
  return (
    <FormControl label={labelStr}>
      <Select
        label={labelStr}
        {...args}
        icon={<CalendarClockIcon fontSize={24} />}
        variant="stylised"
      >
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </Select>
    </FormControl>
  )
}

export const NoIcon: Story = ({ label, ...args }) => {
  const labelStr = label?.length ? label : "Select option"
  return (
    <FormControl label={labelStr}>
      <Select label={labelStr} {...args}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </Select>
    </FormControl>
  )
}

export const TypesAndStates: Story = ({ label, ...args }) => {
  const labelStr = label?.length ? label : "Select option"
  const states = ["normal", "disabled", "error"]
  const types = ["unstylised", "stylised"]
  return (
    <PropsTable columns={states} rows={types}>
      {(column, row, key) => {
        const isDisabled = column === "disabled"
        const isError = column === "error"
        const stylised = row === "stylised"
        return (
          <FormControl
            disabled={isDisabled}
            errorMessage={isError ? "This field has an error" : undefined}
            invalid={isError}
            key={key}
            label={labelStr}
          >
            <Select
              disabled={isDisabled}
              icon={<CalendarClockIcon fontSize={24} />}
              label={labelStr}
              variant={stylised ? "stylised" : undefined}
              {...args}
            >
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </Select>
          </FormControl>
        )
      }}
    </PropsTable>
  )
}
