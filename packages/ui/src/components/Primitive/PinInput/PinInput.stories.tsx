import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { FormControl } from "@yamada-ui/react"
import { PinInput } from "./PinInput"
import { PIN_INPUT_TYPES, PinInputType } from "./types"

type Story = StoryFn<typeof PinInput>

const meta: Meta<typeof PinInput> = {
  component: PinInput,
  title: "Primitive Components / PinInput",
  argTypes: {
    type: {
      control: "select",
      options: PIN_INPUT_TYPES,
      description: "The type of the pin input field",
      table: {
        type: { summary: `"${PIN_INPUT_TYPES.join('" | "')}"` },
        defaultValue: { summary: `"${PinInputType.Number}"` },
      },
    },

    items: {
      control: { type: "number", min: 1, max: 10 },
      description: "The number of pin input fields to render",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "4" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the pin input is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    mask: {
      control: "boolean",
      description: "Whether to mask the input values (like password)",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    otp: {
      control: "boolean",
      description: "Whether to use autocomplete='one-time-code' for OTP",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
}

export default meta

export const Basic: Story = ({ type, ...args }) => {
  return (
    <FormControl label="Verification Code">
      <PinInput type={type || PinInputType.Number} {...args} />
    </FormControl>
  )
}

export const TypesAndStates: Story = (args) => {
  const states = ["normal", "disabled", "error"]

  return (
    <PropsTable columns={states} rows={PIN_INPUT_TYPES}>
      {(column, row, key) => {
        const isDisabled = column === "disabled"
        const isError = column === "error"
        return (
          <FormControl
            disabled={isDisabled}
            errorMessage={isError ? "This field has an error" : undefined}
            invalid={isError}
            key={key}
            label={`${row} PIN`}
          >
            <PinInput disabled={isDisabled} items={4} type={row} {...args} />
          </FormControl>
        )
      }}
    </PropsTable>
  )
}

export const SizeVariations: Story = (args) => {
  const sizes = ["sm", "md", "lg"]

  return (
    <PropsTable columns={sizes} rows={PIN_INPUT_TYPES}>
      {(column, row, key) => {
        return (
          <FormControl key={key} label={`${row} ${column}`}>
            <PinInput items={4} size={column} type={row} {...args} />
          </FormControl>
        )
      }}
    </PropsTable>
  )
}

export const LengthVariations: Story = (args) => {
  const lengths = [3, 4, 5, 6]
  const types = PIN_INPUT_TYPES

  return (
    <PropsTable columns={types} rows={lengths.map(String)}>
      {(column, row, key) => {
        return (
          <FormControl key={key} label={`${row}-digit ${column}`}>
            <PinInput items={Number(row)} type={column} {...args} />
          </FormControl>
        )
      }}
    </PropsTable>
  )
}
