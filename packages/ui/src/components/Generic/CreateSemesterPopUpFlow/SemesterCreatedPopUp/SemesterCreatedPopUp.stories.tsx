import { Button } from "@repo/ui/components/Primitive"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { SemesterCreatedPopUp } from "./SemesterCreatedPopUp"

type Story = StoryObj<typeof SemesterCreatedPopUp>

const meta: Meta<typeof SemesterCreatedPopUp> = {
  component: SemesterCreatedPopUp,
  title: "Generic Components/CreateSemesterPopUpFlow/SemesterCreatedPopUp",
  decorators: [
    (Story) => (
      <div
        style={{ height: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Show Success Message</Button>
        <SemesterCreatedPopUp
          {...args}
          isOpen={isOpen}
          onClose={() => {
            console.log("Closed")
            setIsOpen(false)
          }}
        />
      </>
    )
  },
  args: {
    title: "Semester Created",
    subtitle: "Semester Name created. \n Note: Semester Name can be edited later.",
  },
}

export const WithoutSubtitle: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Show Success (No Subtitle)</Button>
        <SemesterCreatedPopUp
          {...args}
          isOpen={isOpen}
          onClose={() => {
            console.log("Closed")
            setIsOpen(false)
          }}
        />
      </>
    )
  },
  args: {
    title: "Semester Created!",
  },
}
