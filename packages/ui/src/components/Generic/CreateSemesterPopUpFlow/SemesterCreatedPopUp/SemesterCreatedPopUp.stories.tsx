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
        onBack={() => {
          console.log("Back")
          setIsOpen(false)
        }}
        onClose={() => {
          console.log("Cancelled")
          setIsOpen(false)
        }}
        onConfirm={() => {
          console.log("Confirmed")
          setIsOpen(false)
        }}
        open={isOpen}
      />
    )
  },
  args: {
    title: "Semester Creation Confirmation",
    data: {
      name: "Semester 1 2025",
      startDate: "2025-02-24T00:00:00.000Z",
      endDate: "2025-06-20T00:00:00.000Z",
      breakStart: "2025-04-14T00:00:00.000Z",
      breakEnd: "2025-04-25T00:00:00.000Z",
      bookingOpenDay: "monday",
      bookingOpenTime: "1970-01-01T08:00:00.000Z",
    },
  },
}
