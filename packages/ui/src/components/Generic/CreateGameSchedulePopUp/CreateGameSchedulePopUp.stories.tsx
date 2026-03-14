import { gameSessionScheduleMock } from "@repo/shared/mocks"
import type { Meta, StoryFn } from "@storybook/nextjs-vite"
import {
  CreateGameSchedulePopUp,
  type CreateGameSchedulePopUpProps,
} from "./CreateGameSchedulePopUp"

const meta: Meta<CreateGameSchedulePopUpProps> = {
  title: "Generic Components / CreateGameSchedulePopUp",
  component: CreateGameSchedulePopUp,
  argTypes: {
    title: { control: "text", description: "The dialog header title" },
    scheduleToEdit: { control: "object", description: "Object to pre-fill input fields" },
    onConfirm: { action: "confirmed" },
  },
  args: {
    title: "Create Game Schedule",
  },
}

export default meta
type Story = StoryFn<typeof CreateGameSchedulePopUp>

export const Default: Story = () => {
  return <CreateGameSchedulePopUp onConfirm={(val) => console.log("Confirmed:", val)} open />
}

export const PrefilledData: Story = () => {
  return (
    <CreateGameSchedulePopUp
      onConfirm={(val) => console.log("Confirmed:", val)}
      open
      scheduleToEdit={gameSessionScheduleMock}
    />
  )
}
