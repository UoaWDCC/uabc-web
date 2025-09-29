import { Button } from "@repo/ui/components/Primitive"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { SemesterDatePopUp } from "./SemesterDatePopUp"

type Story = StoryObj<typeof SemesterDatePopUp>

const meta: Meta<typeof SemesterDatePopUp> = {
  component: SemesterDatePopUp,
  title: "Generic Components/CreateSemesterPopUpFlow/SemesterDatePopUp",
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
        <Button onClick={() => setIsOpen(true)}>Set Semester Dates</Button>
        <SemesterDatePopUp
          {...args}
          onClose={() => {
            console.log("Closed")
            setIsOpen(false)
          }}
          onNext={(data) => {
            console.log("Next clicked with data:", data)
            setIsOpen(false)
          }}
          open={isOpen}
        />
      </>
    )
  },
  args: {
    title: "Start & End Dates",
    subtitle: "Select start and end dates for [Semester Name]",
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  },
}
