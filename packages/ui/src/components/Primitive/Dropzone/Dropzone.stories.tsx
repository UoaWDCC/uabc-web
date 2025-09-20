import type { Meta, StoryFn } from "@storybook/react"
import { Dropzone } from "./Dropzone"

const meta: Meta<typeof Dropzone> = {
  title: "Primitive Components / Dropzone",
  component: Dropzone,
  argTypes: {
    title: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
  },
  args: {
    size: "md",
  },
}

type Story = StoryFn<typeof Dropzone>

export const Default: Story = (args) => {
  return <Dropzone {...args} />
}

export const Disabled: Story = (args) => {
  return <Dropzone disabled {...args} />
}

export default meta
