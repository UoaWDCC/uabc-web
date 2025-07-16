import { tokens } from "@repo/theme"
import type { Meta, StoryObj } from "@storybook/react"
import { SessionCountIcon } from "./SessionCountIcon"

const fontSizes = Object.keys(tokens.fontSizes)

const meta: Meta<typeof SessionCountIcon> = {
  title: "Generic Components / SessionCountIcon",
  component: SessionCountIcon,
  argTypes: {
    color: {
      control: "color",
      description: "Color of the session children text",
      table: { summary: { type: "string" } },
    },
    count: {
      control: "number",
      description: "Number of sessions to display. If not provided, the children will be used.",
      table: { summary: { type: "number" } },
    },
    fontSize: {
      control: "select",
      description: "Font size of the session children text",
      table: { summary: { type: "string" } },
      options: fontSizes,
    },
  },
  args: {
    color: "white",
    count: 0,
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
