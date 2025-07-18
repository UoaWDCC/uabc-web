import type { Meta, StoryObj } from "@storybook/react"
import { VStack } from "@yamada-ui/react"
import { AdditionalInfoForm } from "./AdditionalInfoForm"

const meta = {
  title: "Generic Components / RegisterFlow / AdditionalInfoForm",
  component: AdditionalInfoForm,
  decorators: [
    (Story) => (
      <VStack h="lg">
        <Story />
      </VStack>
    ),
  ],
} satisfies Meta<typeof AdditionalInfoForm>

export default meta
type Story = StoryObj<typeof AdditionalInfoForm>

export const Default: Story = {}
