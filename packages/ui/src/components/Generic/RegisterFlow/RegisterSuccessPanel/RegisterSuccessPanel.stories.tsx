import type { Meta, StoryObj } from "@storybook/react"
import { VStack } from "@yamada-ui/react"
import { RegisterSuccessPanel } from "./RegisterSuccessPanel"

const meta = {
  title: "Generic Components / RegisterFlow / RegisterSuccessPanel",
  component: RegisterSuccessPanel,
  decorators: [
    (Story) => (
      <VStack h="md">
        <Story />
      </VStack>
    ),
  ],
} satisfies Meta<typeof RegisterSuccessPanel>

export default meta
type Story = StoryObj<typeof RegisterSuccessPanel>

export const Default: Story = {}
