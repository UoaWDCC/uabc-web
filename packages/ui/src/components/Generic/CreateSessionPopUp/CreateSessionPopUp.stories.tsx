import type { Meta, StoryFn } from "@storybook/nextjs-vite"
import { Box, Button, useDisclosure } from "@yamada-ui/react"
import { CreateSessionPopUp, type CreateSessionPopUpProps } from "./CreateSessionPopUp"

const meta: Meta<CreateSessionPopUpProps> = {
  title: "Generic Components / CreateSessionPopUp",
  component: CreateSessionPopUp,
  argTypes: {
    title: { control: "text", description: "The dialog header title" },
    description: { control: "text", description: "The dialog body description" },
    startTime: { control: "date", description: "Default start time" },
    endTime: { control: "date", description: "Default end time" },
    memberCapacity: { control: "number", description: "Default member capacity" },
    casualCapacity: { control: "number", description: "Default casual capacity" },
    inputPlaceholder: { control: "text", description: "Placeholder for input fields" },
    onConfirm: { action: "confirmed" },
  },
  args: {
    title: "Create New Session",
    description: "Fill in the details below to create a new session.",
    startTime: new Date(),
    endTime: new Date(),
    memberCapacity: 20,
    casualCapacity: 10,
    inputPlaceholder: "Enter number",
  },
}

export default meta
type Story = StoryFn<typeof CreateSessionPopUp>

export const Default: Story = () => {
  const { open, onOpen, onClose } = useDisclosure()

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
        startTime={new Date()}
        title="Create New Session"
      />
    </Box>
  )
}
