import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { SemesterCreatedPopUp } from "./SemesterCreatedPopUp"

type Story = StoryObj<typeof SemesterCreatedPopUp>

const meta: Meta<typeof SemesterCreatedPopUp> = {
  component: SemesterCreatedPopUp,
  title: "Generic Components/CreateSemesterPopUpFlow/SemesterCreatedPopUp",
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
      <SemesterCreatedPopUp
        {...args}
        onClose={() => {
          console.log("Closed")
          setIsOpen(false)
        }}
        open={isOpen}
      />
    )
  },
  args: {
    title: "Semester Created",
    subtitle: "Semester Name has been created.",
  },
}
