import type { User } from "@repo/shared/payload-types"
import type { Meta, StoryFn } from "@storybook/nextjs-vite"
import { Box, Button, useDisclosure } from "@yamada-ui/react"
import { CreateMemberPopUp, type CreateMemberPopUpProps } from "./CreateMemberPopUp"

const meta: Meta<CreateMemberPopUpProps> = {
  title: "Generic Components / CreateMemberPopUp",
  component: CreateMemberPopUp,
  argTypes: {
    title: { control: "text", description: "The dialog header title" },
    userToEdit: { control: "object", description: "Object to pre-fill input fields" },
    onConfirm: { action: "confirmed" },
  },
  args: {
    title: "Create New Member",
  },
}

export default meta
type Story = StoryFn<typeof CreateMemberPopUp>

export const Default: Story = () => {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <Box maxW={{ base: "none", md: "33%" }}>
      <Button onClick={onOpen}>Open</Button>
      <CreateMemberPopUp
        onClose={onClose}
        onConfirm={(val) => console.log("Confirmed:", val)}
        open={open}
      />
    </Box>
  )
}

export const PrefilledData: Story = () => {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <Box maxW={{ base: "none", md: "33%" }}>
      <Button onClick={onOpen}>Open</Button>
      <CreateMemberPopUp
        onClose={onClose}
        onConfirm={(val) => console.log("Confirmed:", val)}
        open={open}
        userToEdit={
          {
            firstName: "Alice",
            lastName: "Smith",
            email: "alice@example.com",
            phoneNumber: "123456789",
          } as User
        }
      />
    </Box>
  )
}
