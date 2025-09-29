import { Button } from "@repo/ui/components/Primitive"
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { CreateSemesterPopUpFlow } from "./CreateSemesterPopUpFlow"

type Story = StoryObj<typeof CreateSemesterPopUpFlow>

const meta: Meta<typeof CreateSemesterPopUpFlow> = {
  component: CreateSemesterPopUpFlow,
  title: "Generic Components/CreateSemesterPopUpFlow",
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
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Create New Semester</Button>
        <CreateSemesterPopUpFlow
          {...args}
          onClose={() => {
            console.log("Flow closed")
            setIsOpen(false)
          }}
          onComplete={(data) => {
            console.log("Semester creation completed with data:", data)
            setIsOpen(false)
          }}
          open={isOpen}
        />
      </>
    )
  },
  args: {},
}
