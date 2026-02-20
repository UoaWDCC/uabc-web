import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { SemesterDatePopUp } from "./SemesterDatePopUp"

type Story = StoryObj<typeof SemesterDatePopUp>

const meta: Meta<typeof SemesterDatePopUp> = {
  component: SemesterDatePopUp,
  title: "Generic Components/CreateSemesterPopUpFlow/SemesterDatePopUp",
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
      <SemesterDatePopUp
        {...args}
        onClose={() => {
          console.log("Closed")
          setIsOpen(false)
        }}
        onNext={(data) => {
          console.log("Next clicked with semester data:", data)
          setIsOpen(false)
        }}
        open={isOpen}
      />
    )
  },
  args: {
    title: "Start & End Dates",
    subtitle: "Select the start and end dates for the semester period",
    semesterName: "Fall 2024",
  },
}

export const BreakDates: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <SemesterDatePopUp
        {...args}
        onClose={() => {
          console.log("Closed")
          setIsOpen(false)
        }}
        onNext={(data) => {
          console.log("Next clicked with break data:", data)
          setIsOpen(false)
        }}
        open={isOpen}
      />
    )
  },
  args: {
    title: "Semester Break\nStart & End",
    subtitle: "Select the start and end dates for the break period",
    semesterName: "Fall 2024",
  },
}
