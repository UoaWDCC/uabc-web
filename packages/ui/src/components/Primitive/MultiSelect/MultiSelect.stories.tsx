import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { CalendarClockIcon } from "@yamada-ui/lucide"
import { FormControl, Option } from "@yamada-ui/react"
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

export const Basic: Story = ({ label, ...args }) => {
  const labelStr = label?.length ? label : "Select option(s)"
  return (
    <FormControl label={labelStr}>
      <MultiSelect label={labelStr} {...args} icon={<CalendarClockIcon fontSize={24} />}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </MultiSelect>
    </FormControl>
  )
}

export const Stylised: Story = ({ label, ...args }) => {
  const labelStr = label?.length ? label : "Select option(s)"
  return (
    <FormControl label={labelStr}>
      <MultiSelect
        label={labelStr}
        {...args}
        icon={<CalendarClockIcon fontSize={24} />}
        variant="stylised"
      >
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </MultiSelect>
    </FormControl>
  )
}

export const NoIcon: Story = ({ label, ...args }) => {
  const labelStr = label?.length ? label : "Select option(s)"
  return (
    <FormControl label={labelStr}>
      <MultiSelect label={labelStr} {...args}>
        <Option value="1">Option 1</Option>
        <Option value="2">Option 2</Option>
        <Option value="3">Option 3</Option>
      </MultiSelect>
    </FormControl>
  )
}

export const TypesAndStates: Story = ({ label, ...args }) => {
  const labelStr = label?.length ? label : "Select option(s)"
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
            <MultiSelect
              {...args}
              disabled={isDisabled}
              icon={<CalendarClockIcon fontSize={24} />}
              label={labelStr}
              variant={stylised ? "stylised" : undefined}
            >
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
              <Option value="3">Option 3</Option>
            </MultiSelect>
          </FormControl>
        )
      }}
    </PropsTable>
  )
}
