import type { Meta, StoryObj } from "@storybook/react"
import { VStack } from "@yamada-ui/react"
import { UniversityInfoForm } from "./UniversityInfoForm"

const meta = {
  title: "Generic Components / RegisterFlow / UniversityInfoForm",
  component: UniversityInfoForm,
  decorators: [
    (Story) => (
      <VStack h="md">
        <Story />
      </VStack>
    ),
  ],
} satisfies Meta<typeof UniversityInfoForm>

export default meta
type Story = StoryObj<typeof UniversityInfoForm>

export const Default: Story = {}
