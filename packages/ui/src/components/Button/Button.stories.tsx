import { BUTTON_VARIANTS } from "@repo/theme/components"
import { SEMANTIC_COLOR_SCHEMES } from "@repo/theme/semantics"
import type { Meta, StoryFn } from "@storybook/react"
import Link from "next/link"
import { PropsTable } from "../../../.storybook/components"
import { Button } from "./Button"

type Story = StoryFn<typeof Button>

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Components / Button",
  argTypes: {
    colorScheme: {
      control: "select",
      options: SEMANTIC_COLOR_SCHEMES,
      description: "The color scheme of the button",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "primary" },
      },
    },
    variant: {
      control: "select",
      options: BUTTON_VARIANTS,
      description: "The variant of the button",
      table: {
        type: { summary: `"${BUTTON_VARIANTS.join('" | "')}"` },
        defaultValue: { summary: "solid" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    as: {
      control: "select",
      options: ["button", "a", "Link"],
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
}

export default meta

export const Basic: Story = (args) => {
  return <Button {...args}>Button</Button>
}

export const Variant: Story = (args) => {
  return (
    <PropsTable columns={BUTTON_VARIANTS} rows={SEMANTIC_COLOR_SCHEMES}>
      {(column, row, key) => {
        return (
          <Button colorScheme={row} key={key} variant={column} {...args}>
            Button
          </Button>
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
          <Button colorScheme={row} disabled key={key} variant={column} {...args}>
            Button
          </Button>
        )
      }}
    </PropsTable>
  )
}

export const ButtonLink: Story = (args) => {
  return (
    <PropsTable columns={BUTTON_VARIANTS} rows={SEMANTIC_COLOR_SCHEMES}>
      {(column, row, key) => {
        return (
          <Button as={Link} colorScheme={row} href="#" key={key} variant={column} {...args}>
            Button
          </Button>
        )
      }}
    </PropsTable>
  )
}

ButtonLink.argTypes = {
  href: {
    control: "text",
    description: "The href attribute of the link",
    table: {
      type: { summary: "string" },
    },
  },
}
