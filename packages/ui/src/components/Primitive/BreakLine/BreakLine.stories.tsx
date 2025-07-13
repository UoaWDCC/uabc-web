import type { Meta, StoryFn } from "@storybook/nextjs"
import { VStack } from "@yamada-ui/react"
import { BreakLine } from "./BreakLine"

type Story = StoryFn<typeof BreakLine>

const meta = {
  title: "Primitive Components / BreakLine",
  component: BreakLine,
  argTypes: {},
} satisfies Meta<typeof BreakLine>

export default meta

export const Default: Story = (args) => {
  return (
    <VStack>
      <BreakLine {...args} />
    </VStack>
  )
}

export const WithLabel: Story = (args) => {
  return (
    <VStack>
      <BreakLine {...args} label="label" />
    </VStack>
  )
}

export const WithFade: Story = (args) => {
  return (
    <VStack>
      <BreakLine
        {...args}
        label="label"
        separatorProps1={{ border: 0, layerStyle: "fadeLeft" }}
        separatorProps2={{ border: 0, layerStyle: "fadeRight" }}
      />
    </VStack>
  )
}
