import { defaultTheme } from "@repo/theme"
import type { Meta, StoryObj } from "@storybook/react"
import { SessionCountIcon } from "./SessionCountIcon"

const fontSizes = Object.keys(defaultTheme.fontSizes ?? {})

const meta: Meta<typeof SessionCountIcon> = {
  title: "Generic Components / SessionCountIcon",
  component: SessionCountIcon,
  argTypes: {
    count: {
      control: "number",
      description: "Number of sessions to display",
    },
    color: {
      control: "color",
      description: "Color of the session count text",
      table: { summary: { type: "string" } },
    },
    fontSize: {
      control: "select",
      description: "Font size of the session count text",
      table: { summary: { type: "string" } },
      options: fontSizes,
    },
  },
  args: {
    count: 0,
    color: "white",
    fontSize: "9xl",
  },
}
export default meta

type Story = StoryObj<typeof SessionCountIcon>

export const Default: Story = {
  args: {
    count: 1,
  },
}

export const DoubleDigits: Story = {
  args: {
    count: 24,
  },
}
