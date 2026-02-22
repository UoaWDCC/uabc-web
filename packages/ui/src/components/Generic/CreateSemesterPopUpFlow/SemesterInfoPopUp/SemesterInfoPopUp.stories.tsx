import { Weekday } from "@repo/shared/types"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { SemesterInfoPopUp } from "./SemesterInfoPopUp"

type Story = StoryObj<typeof SemesterInfoPopUp>

const meta: Meta<typeof SemesterInfoPopUp> = {
  component: SemesterInfoPopUp,
  title: "Generic Components/CreateSemesterPopUpFlow/SemesterInfoPopUp",
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
      <SemesterInfoPopUp
        {...args}
        onBack={() => {
          console.log("Back clicked")
          setIsOpen(false)
        }}
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
    )
  },
  args: {},
}

export const WithDefaultValues: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <SemesterInfoPopUp
        {...args}
        onBack={() => {
          console.log("Back clicked")
          setIsOpen(false)
        }}
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
    )
  },
  args: {
    defaultValues: {
      bookingOpenDay: Weekday.monday,
      bookingOpenTime: "12:00",
    },
  },
}
