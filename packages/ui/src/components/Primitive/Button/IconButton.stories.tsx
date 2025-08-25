import { BUTTON_VARIANTS } from "@repo/theme/components"
import { SEMANTIC_COLOR_SCHEMES } from "@repo/theme/semantics"
import { SIZE_TOKENS } from "@repo/theme/tokens"
import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { HeartIcon, PlusIcon, SettingsIcon, XIcon } from "@yamada-ui/lucide"
import { IconButton } from "./IconButton"

type Story = StoryFn<typeof IconButton>

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  title: "Primitive Components / IconButton",
  argTypes: {
    colorScheme: {
      control: "select",
      options: SEMANTIC_COLOR_SCHEMES,
      description: "The color scheme of the icon button",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "secondary" },
      },
    },
    variant: {
      control: "select",
      options: BUTTON_VARIANTS,
      description: "The variant of the icon button",
      table: {
        type: { summary: `"${BUTTON_VARIANTS.join('" | "')}"` },
        defaultValue: { summary: "solid" },
      },
    },
    size: {
      control: "select",
      options: SIZE_TOKENS,
      description: "The size of the icon button",
      table: {
        type: { summary: `"${SIZE_TOKENS.join('" | "')}"` },
        defaultValue: { summary: "md" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the icon button is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    loading: {
      control: "boolean",
      description: "Whether the icon button is in loading state",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    active: {
      control: "boolean",
      description: "Whether the icon button is in active state",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    as: {
      control: "select",
      options: ["button", "a"],
      description: "The component used for the root node",
      table: {
        type: { summary: "ElementType" },
        defaultValue: { summary: "button" },
      },
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "The type of the button",
      table: {
        type: { summary: '"button" | "submit" | "reset"' },
        defaultValue: { summary: "button" },
      },
    },
  },
  args: {
    "aria-label": "Icon button",
    icon: <PlusIcon />,
  },
}

export default meta

export const Basic: Story = (args) => {
  return <IconButton {...args} />
}

export const Sizes: Story = (args) => {
  return (
    <PropsTable columns={BUTTON_VARIANTS} rows={SIZE_TOKENS}>
      {(column, row, key) => {
        return (
          <IconButton
            aria-label={`${column} ${row} icon button`}
            key={key}
            size={row}
            variant={column}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const Variant: Story = (args) => {
  return (
    <PropsTable columns={BUTTON_VARIANTS} rows={SEMANTIC_COLOR_SCHEMES}>
      {(column, row, key) => {
        return (
          <IconButton
            aria-label={`${row} ${column} icon button`}
            colorScheme={row}
            key={key}
            variant={column}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const Disabled: Story = (args) => {
  return (
    <PropsTable columns={BUTTON_VARIANTS} rows={SEMANTIC_COLOR_SCHEMES}>
      {(column, row, key) => {
        return (
          <IconButton
            aria-label={`Disabled ${row} ${column} icon button`}
            colorScheme={row}
            disabled
            key={key}
            variant={column}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const Loading: Story = (args) => {
  return (
    <PropsTable columns={BUTTON_VARIANTS} rows={SEMANTIC_COLOR_SCHEMES}>
      {(column, row, key) => {
        return (
          <IconButton
            aria-label={`Loading ${row} ${column} icon button`}
            colorScheme={row}
            key={key}
            loading
            variant={column}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const Active: Story = (args) => {
  return (
    <PropsTable columns={BUTTON_VARIANTS} rows={SEMANTIC_COLOR_SCHEMES}>
      {(column, row, key) => {
        return (
          <IconButton
            active
            aria-label={`Active ${row} ${column} icon button`}
            colorScheme={row}
            key={key}
            variant={column}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const FullRounded: Story = (args) => {
  return (
    <PropsTable columns={BUTTON_VARIANTS} rows={SEMANTIC_COLOR_SCHEMES}>
      {(column, row, key) => {
        return (
          <IconButton
            aria-label={`Full rounded ${row} ${column} icon button`}
            colorScheme={row}
            key={key}
            rounded="full"
            variant={column}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}

export const DifferentIcons: Story = (args) => {
  const icons = [
    { icon: <PlusIcon />, label: "Add" },
    { icon: <HeartIcon />, label: "Favorite" },
    { icon: <SettingsIcon />, label: "Settings" },
    { icon: <XIcon />, label: "Close" },
  ]

  const { icon: _, ...restArgs } = args

  return (
    <PropsTable columns={icons.map((i) => i.label)} rows={SIZE_TOKENS}>
      {(column, row, key) => {
        const iconData = icons.find((i) => i.label === column)
        return (
          <IconButton
            aria-label={`${iconData?.label} ${row}`}
            icon={iconData?.icon}
            key={key}
            size={row}
            {...restArgs}
          />
        )
      }}
    </PropsTable>
  )
}
