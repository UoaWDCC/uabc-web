import { SEMANTIC_COLOR_SCHEMES } from "@repo/theme/semantics"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PropsTable } from "@storybook-config/components"
import { LoadingStateBar } from "./LoadingStateBar"

const meta: Meta<typeof LoadingStateBar> = {
  title: "Primitive Components / LoadingStateBar",
  component: LoadingStateBar,
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "The value of the progress (0-100)",
    },
    colorScheme: {
      control: "text",
      description: "Custom color for the progress bar",
    },
    disabled: {
      control: "boolean",
      description: "Whether the loading bar is disabled",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Size of the progress bar",
    },
    max: {
      control: "number",
      description: "Maximum value for the progress",
    },
    min: {
      control: "number",
      description: "Minimum value for the progress",
    },
    hasStripe: {
      control: "boolean",
      description: "If true, the progress bar will show stripe",
    },
    isStripeAnimation: {
      control: "boolean",
      description: "If true, and hasStripe is true, the stripes will be animated",
    },
    isAnimation: {
      control: "boolean",
      description: "If true, the progress will be indeterminate and the value prop will be ignored",
    },
    speed: {
      control: "text",
      description: "The animation speed in seconds",
    },
  },
  args: {
    value: 45,
    colorScheme: "primary",
    disabled: false,
    size: "md",
    max: 100,
    min: 0,
    hasStripe: false,
    isStripeAnimation: false,
    isAnimation: false,
    speed: "1.4s",
  },
}

export default meta
type Story = StoryObj<typeof LoadingStateBar>

export const Default: Story = {
  args: {
    value: 45,
  },
}

export const DisabledState: Story = {
  args: {
    value: 30,
    disabled: true,
  },
}

export const StripedVariant: Story = {
  args: {
    value: 65,
    hasStripe: true,
    colorScheme: "primary",
  },
}

export const SpeedVariations: Story = {
  render: (args) => {
    const speeds = ["0.5s", "1s", "1.4s", "2s", "3s"]
    const animationTypes = [
      { label: "Stripe Animation", hasStripe: true, isStripeAnimation: true },
      { label: "Indeterminate", isAnimation: true },
    ]

    return (
      <PropsTable columns={speeds} rows={animationTypes.map((type) => type.label)}>
        {(column, row, key) => {
          const animationType = animationTypes.find((type) => type.label === row)
          return (
            <LoadingStateBar {...args} {...animationType} key={key} speed={column} value={60} />
          )
        }}
      </PropsTable>
    )
  },
}

export const AnimationTypes: Story = {
  render: (args) => {
    const animationStates = [
      { label: "Static", value: 50 },
      { label: "With Stripes", value: 50, hasStripe: true },
      { label: "Animated Stripes", value: 50, hasStripe: true, isStripeAnimation: true },
      { label: "Indeterminate", isAnimation: true },
    ]

    return (
      <PropsTable
        columns={SEMANTIC_COLOR_SCHEMES}
        rows={animationStates.map((state) => state.label)}
      >
        {(column, row, key) => {
          const animationState = animationStates.find((state) => state.label === row)
          return <LoadingStateBar {...args} {...animationState} colorScheme={column} key={key} />
        }}
      </PropsTable>
    )
  },
}

export const ColorVariations: Story = {
  render: (args) => {
    const states = ["normal", "disabled"]

    return (
      <PropsTable columns={states} rows={SEMANTIC_COLOR_SCHEMES}>
        {(column, row, key) => {
          const isDisabled = column === "disabled"
          return (
            <LoadingStateBar
              {...args}
              colorScheme={row}
              disabled={isDisabled}
              key={key}
              value={isDisabled ? 30 : 65}
            />
          )
        }}
      </PropsTable>
    )
  },
}

export const SizeVariations: Story = {
  render: (args) => {
    const sizes = ["xs", "sm", "md", "lg"]
    const values = [25, 50, 75, 100]

    return (
      <PropsTable columns={values.map((v) => `${v}%`)} rows={sizes}>
        {(column, row, key) => {
          const value = Number.parseInt(column.replace("%", ""))
          return <LoadingStateBar {...args} key={key} size={row} value={value} />
        }}
      </PropsTable>
    )
  },
}
