import type { Meta, StoryFn } from "@storybook/react"
import { CalendarClockIcon } from "@yamada-ui/lucide"
import { Center, Option } from "@yamada-ui/react"
import { MobileSingleSelect } from "./MobileSingleSelect"

type Story = StoryFn<typeof MobileSingleSelect>

const meta: Meta<typeof MobileSingleSelect> = {
  component: MobileSingleSelect,
  title: "Components / Select",
  argTypes: {
    label: {
      control: { type: "text" },
      description: "The label text of the Select component",
      table: {
        type: { summary: "string" },
      },
    },
  },
}

export default meta

export const Basic: Story = (args) => {
  return (
    <MobileSingleSelect
      {...args}
      icon={
        <Center
          borderColor="white"
          borderRadius="full"
          borderWidth={1}
          h="fit-content"
          p={1}
          w="fit-content"
        >
          <CalendarClockIcon fontSize={24} />
        </Center>
      }
    >
      <Option value="1">Option 1</Option>
      <Option value="2">Option 2</Option>
      <Option value="3">Option 3</Option>
    </MobileSingleSelect>
  )
}
