import type { Meta, StoryFn } from "@storybook/nextjs"
import { Box, Button, useDisclosure } from "@yamada-ui/react"
import { CreateSessionPopUp, type CreateSessionPopUpProps } from "./CreateSessionPopUp"

const meta: Meta<CreateSessionPopUpProps> = {
  title: "Generic Components / CreateSessionPopUp",
  component: CreateSessionPopUp,
  argTypes: {
    title: { control: "text", description: "The dialog header title" },
    description: { control: "text", description: "The dialog body description" },
    onConfirm: { action: "confirmed" },
  },
  args: {
    title: "Create New Session",
    description: "Fill in the details below to create a new session.",
    weekDay: [
      { label: "Monday", value: "monday" },
      { label: "Tuesday", value: "tuesday" },
      { label: "Wednesday", value: "wednesday" },
      { label: "Thursday", value: "thursday" },
      { label: "Friday", value: "friday" },
      { label: "Saturday", value: "saturday" },
      { label: "Sunday", value: "sunday" },
    ],
    sessionType: [
      { label: "Member", value: "member" },
      { label: "Casual", value: "casual" },
    ],
  },
}

export default meta
type Story = StoryFn<typeof CreateSessionPopUp>

export const Default: Story = () => {
  const { open, onOpen, onClose } = useDisclosure()
  const weekDayOptions = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ]
  const sessionTypeOptions = [
    { label: "Member", value: "member" },
    { label: "Casual", value: "casual" },
  ]
  return (
    <Box maxW={{ base: "none", md: "33%" }}>
      <Button onClick={onOpen}>Open</Button>
      <CreateSessionPopUp
        casualCapacity={10}
        description="Tues HIWA Rec Centre"
        endTime={new Date()}
        inputPlaceholder="Enter Number"
        memberCapacity={10}
        onClose={onClose}
        onConfirm={(val) => console.log("Confirmed:", val)}
        open={open}
        sessionType={sessionTypeOptions}
        startTime={new Date()}
        title="Create New Session"
        weekDay={weekDayOptions}
      />
    </Box>
  )
}
