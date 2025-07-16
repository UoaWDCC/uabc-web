import type { Meta, StoryObj } from "@storybook/react"
import { VStack } from "@yamada-ui/react"
import { BasicInfoForm1 } from "../BasicInfoForm1"

const meta = {
  title: "Composite Components / RegisterFlow / BasicInfoForm1",
  component: BasicInfoForm1,
  decorators: [
    (Story) => (
      <VStack h="md">
        <Story />
      </VStack>
    ),
  ],
} satisfies Meta<typeof BasicInfoForm1>

export default meta
type Story = StoryObj<typeof BasicInfoForm1>

export const Default: Story = {}
