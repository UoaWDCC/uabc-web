import type { Meta, StoryObj } from "@storybook/react"
import { VStack } from "@yamada-ui/react"
import { CasualInfoForm } from "./CasualInfoForm"

const meta = {
  title: "Generic Components / RegisterFlow / CasualInfoForm",
  component: CasualInfoForm,
  decorators: [
    (Story) => (
      <VStack h="md">
        <Story />
      </VStack>
    ),
  ],
} satisfies Meta<typeof CasualInfoForm>

export default meta
type Story = StoryObj<typeof CasualInfoForm>

export const Default: Story = {}
