import type { Meta, StoryFn } from "@storybook/nextjs-vite"
import { Box, Button, useDisclosure } from "@yamada-ui/react"
import { CreateMemberPopUp, type CreateMemberPopUpProps } from "./CreateMemberPopUp"
import { User } from "@repo/shared/payload-types"

const meta: Meta<CreateMemberPopUpProps> = {
  title: "Generic Components / CreateMemberPopUp",
  component: CreateMemberPopUp,
  argTypes: {
    title: { control: "text", description: "The dialog header title" },
    defaultValues: { control: "object", description: "Object to pre-fill input fields" },
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
        defaultValues={
          {
            firstName: "Pre-filled first name",
            lastName: "Pre-filled last name",
            email: "email@gmail.com",
            phoneNumber: "123456789",
          } as User
        }
        onClose={onClose}
        onConfirm={(val) => console.log("Confirmed:", val)}
        open={open}
      />
    </Box>
  )
}
