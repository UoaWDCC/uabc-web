import { mockCasualMemberInformation } from "@repo/ui/test-config/mocks/CasualInfoForm.mock"
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
  argTypes: {
    casualMemberInformation: {
      control: "object",
      description: "Rich text data displayed in the form",
      table: {
        type: { summary: "OnboardingGlobal['casualMemberInformation']" },
      },
    },
  },
} satisfies Meta<typeof CasualInfoForm>

export default meta
type Story = StoryObj<typeof CasualInfoForm>

export const Default: Story = {
  args: {
    casualMemberInformation: mockCasualMemberInformation,
  },
}
