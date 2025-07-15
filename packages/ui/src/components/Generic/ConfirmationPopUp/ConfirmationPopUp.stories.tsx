import type { Meta, StoryObj } from "@storybook/react"
import { ConfirmationPopUp } from "./ConfirmationPopUp"

const meta: Meta<typeof ConfirmationPopUp> = {
  title: "Generic Components / ConfirmationPopUp",
  component: ConfirmationPopUp,
  argTypes: {
    title: {
      control: "text",
      description: "Title of the confirmation pop-up",
      table: {
        type: { summary: "string" },
      },
    },
    subtitle: {
      control: "text",
      description: "Subtitle or additional information in the confirmation pop-up",
      table: {
        type: { summary: "string" },
      },
    },
    closeButton: {
      control: "boolean",
      description: "Whether to show the close button in the confirmation pop-up",
      table: {
        type: { summary: "boolean" },
      },
    },
    confirmButton: {
      control: "object",
      description: "Confirm button configuration with children and click handler",
      table: {
        type: { summary: "{ children: React.ReactNode; onClick?: () => void }" },
      },
    },
    cancelButton: {
      control: "object",
      description: "Cancel button configuration with children and click handler",
      table: {
        type: { summary: "{ children: React.ReactNode; onClick?: () => void }" },
      },
    },
  },
  args: {
    title: "Delete Account",
    subtitle: "Are you sure you want to delete account?",
    closeButton: true,
    confirmButton: { children: "Delete" },
    cancelButton: { children: "Cancel" },
    open: true,
    onClose: () => {},
  },
}
export default meta

type Story = StoryObj<typeof ConfirmationPopUp>

export const Default: Story = {}

export const NoCloseButton: Story = {
  args: {
    closeButton: false,
  },
}

export const WithCancelButton: Story = {
  args: {
    cancelButton: { children: "Cancel" },
  },
}
