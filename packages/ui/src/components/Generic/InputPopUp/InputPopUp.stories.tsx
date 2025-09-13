import type { Meta, StoryFn } from "@storybook/nextjs-vite"
import { Box, Button, useDisclosure } from "@yamada-ui/react"
import { InputPopUp, type InputPopUpProps } from "./InputPopUp"

const meta: Meta<InputPopUpProps> = {
  title: "Generic Components / InputPopUp",
  component: InputPopUp,
  argTypes: {
    title: { control: "text", description: "The dialog header title" },
    description: { control: "text", description: "The dialog body description" },
    onConfirm: { action: "confirmed" },
  },
  args: {
    title: "Create New Semester",
    description: "Enter Semester Name:",
  },
}

export default meta
type Story = StoryFn<typeof InputPopUp>

export const Default: Story = () => {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <Box maxW={{ base: "none", md: "33%" }}>
      <Button onClick={onOpen}>Open</Button>
      <InputPopUp
        description="Enter Semester Name:"
        onClose={onClose}
        onConfirm={(val) => console.log("Confirmed:", val)}
        open={open}
        title="Create New Semester"
      />
    </Box>
  )
}
