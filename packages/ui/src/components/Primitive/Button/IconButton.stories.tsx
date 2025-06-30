import { BUTTON_VARIANTS } from "@repo/theme/components"
import { SEMANTIC_COLOR_SCHEMES } from "@repo/theme/semantics"
import { SIZE_TOKENS } from "@repo/theme/tokens"
import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { IconButton } from "./IconButton"

const AddIcon = () => (
  <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
  </svg>
)

const HeartIcon = () => (
  <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
  </svg>
)

const SettingsIcon = () => (
  <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
  </svg>
)

const CloseIcon = () => (
  <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
  </svg>
)

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
    fullRounded: {
      control: "boolean",
      description: "Whether the icon button is fully rounded",
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
    icon: <AddIcon />,
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
            fullRounded
            key={key}
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
    { icon: <AddIcon />, label: "Add" },
    { icon: <HeartIcon />, label: "Favorite" },
    { icon: <SettingsIcon />, label: "Settings" },
    { icon: <CloseIcon />, label: "Close" },
  ]

  return (
    <PropsTable columns={icons.map((i) => i.label)} rows={["sm", "md", "lg"]}>
      {(column, row, key) => {
        const iconData = icons.find((i) => i.label === column)
        return (
          <IconButton
            aria-label={`${iconData?.label} ${row}`}
            icon={iconData?.icon}
            key={key}
            size={row}
            {...args}
          />
        )
      }}
    </PropsTable>
  )
}
