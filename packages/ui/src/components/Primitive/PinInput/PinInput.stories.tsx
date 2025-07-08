import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { VStack } from "@yamada-ui/react"
import { PinInput } from "./PinInput"
import {
  PIN_INPUT_SIZES,
  PIN_INPUT_TYPES,
  PIN_INPUT_VARIANTS,
  PinInputSize,
  PinInputType,
  PinInputVariant,
} from "./types"

type Story = StoryFn<typeof PinInput>

const meta: Meta<typeof PinInput> = {
  component: PinInput,
  title: "Primitive Components / PinInput",
  argTypes: {
    label: {
      control: "text",
      description: "The label text for the pin input field",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    type: {
      control: "select",
      options: PIN_INPUT_TYPES,
      description: "The type of the pin input field",
      table: {
        type: { summary: `"${PIN_INPUT_TYPES.join('" | "')}"` },
        defaultValue: { summary: `"${PinInputType.Number}"` },
      },
    },
    size: {
      control: "select",
      options: PIN_INPUT_SIZES,
      description: "The size of the pin input field",
      table: {
        type: { summary: `"${PIN_INPUT_SIZES.join('" | "')}"` },
        defaultValue: { summary: `"${PinInputSize.MD}"` },
      },
    },
    variant: {
      control: "select",
      options: PIN_INPUT_VARIANTS,
      description: "The variant of the pin input field",
      table: {
        type: { summary: `"${PIN_INPUT_VARIANTS.join('" | "')}"` },
        defaultValue: { summary: `"${PinInputVariant.Outline}"` },
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
    isError: {
      control: "boolean",
      description: "Whether the pin input is in an error state",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    errorMessage: {
      control: "text",
      description: "The error message displayed when the pin input is in an error state",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder character for empty pin input fields",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "○" },
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
  return <PinInput label="Verification Code" type={type || PinInputType.Number} {...args} />
}

export const ErrorStates: Story = ({ type, ...args }) => {
  return (
    <VStack>
      <PinInput items={4} label="Valid PIN" type={type || PinInputType.Number} {...args} />
      <PinInput
        errorMessage="Invalid PIN code"
        isError={true}
        items={4}
        label="Invalid PIN"
        type={type || PinInputType.Number}
        {...args}
      />
    </VStack>
  )
}

export const MaskedInput: Story = ({ type, ...args }) => {
  return (
    <VStack>
      <PinInput items={4} label="Regular PIN" type={type || PinInputType.Number} {...args} />
      <PinInput items={4} label="Masked PIN" mask type={type || PinInputType.Number} {...args} />
    </VStack>
  )
}

export const OTPUsage: Story = ({ type, ...args }) => {
  return (
    <VStack>
      <PinInput
        items={6}
        label="SMS Verification Code"
        otp
        type={type || PinInputType.Number}
        {...args}
      />
      <PinInput
        items={4}
        label="Email Verification Code"
        otp
        type={PinInputType.Alphanumeric}
        {...args}
      />
    </VStack>
  )
}

export const CustomStyling: Story = ({ type, ...args }) => {
  return (
    <PinInput
      formControlProps={{
        maxW: "300px",
      }}
      items={4}
      label="Custom Styled PIN"
      type={type || PinInputType.Number}
      {...args}
    />
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
          <PinInput
            disabled={isDisabled}
            errorMessage={isError ? "This field has an error" : undefined}
            isError={isError}
            items={4}
            key={key}
            label={`${row} PIN`}
            type={row}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const SizeVariations: Story = (args) => {
  const variants = PIN_INPUT_VARIANTS

  return (
    <PropsTable columns={variants} rows={PIN_INPUT_SIZES}>
      {(column, row, key) => {
        return (
          <PinInput
            items={4}
            key={key}
            label={`${row} ${column}`}
            size={row}
            type={PinInputType.Number}
            variant={column}
            {...args}
          />
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
          <PinInput
            items={Number(row)}
            key={key}
            label={`${row}-digit ${column}`}
            type={column}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}
