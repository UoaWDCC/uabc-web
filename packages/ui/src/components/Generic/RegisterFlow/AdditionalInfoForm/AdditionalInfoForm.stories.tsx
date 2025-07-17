import type { Meta, StoryObj } from "@storybook/react"
import { VStack } from "@yamada-ui/react"
import { AdditionalInfoForm } from "./AdditionalInfoForm"

const meta = {
  title: "Composite Components / RegisterFlow / AdditionalInfoForm",
  component: AdditionalInfoForm,
  decorators: [
    (Story) => (
      <VStack h="md">
        <Story />
      </VStack>
    ),
  ],
} satisfies Meta<typeof AdditionalInfoForm>

export default meta
type Story = StoryObj<typeof AdditionalInfoForm>

export const Default: Story = {}
