import type { Meta, StoryFn } from "@storybook/react"
import { Clock10Icon } from "@yamada-ui/lucide"
import { VStack } from "@yamada-ui/react"
import { MultiSelect, Select, TextInput } from "."

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: "Primitive Components / Form Components",
}

export default meta

type Story = StoryFn<typeof meta>

const items = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
]

export const Default: Story = () => {
  return (
    <VStack>
      <TextInput placeholder="Enter text" />
      <Select items={items} placeholder="Select an option" />
      <MultiSelect items={items} placeholder="Select an option" />

      <TextInput placeholder="Enter text" startElement={<Clock10Icon />} />
      <Select
        icon={<Clock10Icon />}
        items={items}
        label="Select an option"
        placeholder="Select an option"
      />
      <MultiSelect
        icon={<Clock10Icon />}
        items={items}
        label="Select an option"
        placeholder="Select an option"
      />

      <Select
        icon={<Clock10Icon />}
        items={items}
        label="Select an option"
        placeholder="Select an option"
        variant="stylised"
      />
      <MultiSelect
        icon={<Clock10Icon />}
        items={items}
        label="Select an option"
        placeholder="Select an option"
        variant="stylised"
      />

      <TextInput endElement={<Clock10Icon />} placeholder="Enter text" />
      <TextInput endAddon={<Clock10Icon />} placeholder="Enter text" />
      <TextInput placeholder="Enter text" startAddon={<Clock10Icon />} />
    </VStack>
  )
}
