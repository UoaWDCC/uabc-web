import type { Meta, StoryObj } from "@storybook/react"
import { VStack } from "@yamada-ui/react"
import { BasicInfoForm2 } from "./BasicInfoForm2"

const meta = {
  title: "Composite Components / RegisterFlow / BasicInfoForm2",
  component: BasicInfoForm2,
  decorators: [
    (Story) => (
      <VStack h="md">
        <Story />
      </VStack>
    ),
  ],
} satisfies Meta<typeof BasicInfoForm2>

export default meta
type Story = StoryObj<typeof BasicInfoForm2>

export const Default: Story = {}
