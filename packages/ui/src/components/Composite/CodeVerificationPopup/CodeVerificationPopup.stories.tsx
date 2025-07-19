import { Popup } from "@repo/shared"
import type { Meta, StoryObj } from "@storybook/react"
import { NuqsAdapter } from "nuqs/adapters/react"
import { CodeVerificationPopup } from "./CodeVerificationPopup"

const meta: Meta<typeof CodeVerificationPopup> = {
  component: CodeVerificationPopup,
  title: "Composite Components / CodeVerificationPopup",
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
  parameters: {
    query: {
      [Popup.CODE_VERIFICATION]: "open",
    },
  },
  args: {
    title: "Verify Your Email",
    message: "Please enter the code sent to your email",
    additionalMessage: "The code will expire in 10 minutes.",
  },
}

export default meta

type Story = StoryObj<typeof CodeVerificationPopup>

export const Default: Story = {
  args: {
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    },
  },
}
