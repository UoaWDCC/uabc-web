import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@/storybook-config/components"
import { INPUT_STATES, INPUT_TYPES, InputType, TextInput } from "./TextInput"

type Story = StoryFn<typeof TextInput>

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: "Components / Primitive / TextInput",
  argTypes: {
    label: {
      control: "text",
      description: "The label of the input",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
    type: {
      control: "select",
      options: INPUT_TYPES,
      description: "The type of the input",
      table: {
        type: { summary: `"${INPUT_TYPES.join('" | "')}"` },
        defaultValue: { summary: `"${InputType.Text}"` },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    isError: {
      control: "boolean",
      description: "Whether the input is an error",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    errorMessage: {
      control: "text",
      description: "The error message of the input",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
    placeholderShownLabelCSS: {
      control: "object",
      description: "The CSS styles for the label when the placeholder is shown",
      table: {
        type: { summary: "CSSUIObject" },
        defaultValue: { summary: "{}" },
      },
    },
    placeholderHiddenLabelCSS: {
      control: "object",
      description: "The CSS styles for the label when the placeholder is hidden",
      table: {
        type: { summary: "CSSUIObject" },
        defaultValue: { summary: "{}" },
      },
    },
    focusedLabelCSS: {
      control: "object",
      description: "The CSS styles for the label when the input is focused",
      table: {
        type: { summary: "CSSUIObject" },
        defaultValue: { summary: "{}" },
      },
    },
    activeLabelCSS: {
      control: "object",
      description: "The CSS styles for the label when the input is active",
      table: {
        type: { summary: "CSSUIObject" },
        defaultValue: { summary: "{}" },
      },
    },
    labelProps: {
      control: "object",
      description: "The props for the label",
      table: {
        type: { summary: "LabelProps" },
        defaultValue: { summary: "{}" },
      },
    },
  },
}

export default meta

export const Basic: Story = ({ type, ...args }) => {
  return <TextInput label="Label" type={type || InputType.Text} {...args} />
}

export const Types: Story = ({ type, ...args }) => {
  return (
    <PropsTable rows={INPUT_TYPES} variant="column">
      {(_, row, key) => (
        <TextInput
          key={key}
          label={row.charAt(0).toUpperCase() + row.slice(1)}
          type={row as InputType}
          {...args}
        />
      )}
    </PropsTable>
  )
}

export const States: Story = ({ type, ...args }) => {
  return (
    <PropsTable rows={INPUT_STATES} variant="column">
      {(_, row, key) => {
        const props = {
          ...(row === "disabled" && { disabled: true }),
          ...(row === "error" && { isError: true, errorMessage: "Error message" }),
          ...(row === "hovered" && { "data-hover": true }),
          ...(row === "focused" && { "data-focused": true }),
          ...(row === "active" && { "data-active": true }),
          ...(row === "has-value" && { defaultValue: "Value" }),
        }

        return (
          <TextInput
            key={key}
            label="Input Label"
            placeholder="Placeholder text"
            type={type || InputType.Text}
            {...props}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const CustomStyles: Story = ({ type, ...args }) => {
  return (
    <TextInput
      activeLabelCSS={{
        color: "orange",
      }}
      focusedLabelCSS={{
        color: "red",
      }}
      label="Label"
      labelProps={{
        className: "font-bold",
      }}
      placeholderHiddenLabelCSS={{
        color: "green",
      }}
      placeholderShownLabelCSS={{
        color: "blue",
      }}
      type={type || InputType.Text}
      {...args}
    />
  )
}
