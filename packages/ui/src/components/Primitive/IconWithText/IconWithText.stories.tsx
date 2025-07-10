import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { HeartIcon, PlusIcon, SettingsIcon, XIcon } from "@yamada-ui/lucide"
import { IconWithText } from "./IconWithText"

type Story = StoryFn<typeof IconWithText>

const meta: Meta<typeof IconWithText> = {
  component: IconWithText,
  title: "Primitive Components / IconWithText",
  argTypes: {
    label: {
      control: "text",
      description: "The label to display next to the icon.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "'Test string'" },
      },
    },
  },
  args: {
    "aria-label": "Icon button",
    icon: <PlusIcon />,
    label: "Plus",
  },
}

export default meta

export const Basic: Story = (args) => {
  return <IconWithText {...args} />
}

export const DifferentIcons: Story = () => {
  const icons = [
    { icon: <PlusIcon />, label: "Add" },
    { icon: <HeartIcon />, label: "Favorite" },
    { icon: <SettingsIcon />, label: "Settings" },
    { icon: <XIcon />, label: "Close" },
  ]

  return (
    <PropsTable columns={icons.map((i) => i.label)} rows={["icon"]}>
      {(column) => {
        const iconData = icons.find((i) => i.label === column)
        return <IconWithText icon={iconData?.icon} label={column} />
      }}
    </PropsTable>
  )
}
