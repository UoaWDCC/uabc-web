import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { SemesterNamePopUp } from "./SemesterNamePopUp"

type Story = StoryObj<typeof SemesterNamePopUp>

const meta: Meta<typeof SemesterNamePopUp> = {
  component: SemesterNamePopUp,
  title: "Generic Components/CreateSemesterPopUpFlow/SemesterNamePopUp",
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
}

export default meta

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <SemesterNamePopUp
        {...args}
        onCancel={() => {
          console.log("Cancelled")
          setIsOpen(false)
        }}
        onConfirm={(data) => {
          console.log("Confirmed:", data)
          setIsOpen(false)
        }}
        open={isOpen}
      />
    )
  },
  args: {
    defaultValues: {
      name: "",
    },
  },
}
