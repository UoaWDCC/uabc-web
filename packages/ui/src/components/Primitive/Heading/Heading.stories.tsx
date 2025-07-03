import { defaultTheme } from "@repo/theme"
import type { Meta, StoryFn } from "@storybook/react"
import { PropsTable } from "@storybook-config/components"
import { DEFAULT_FONT_SIZES, FONT_WEIGHTS, Heading } from "./Heading"

type Story = StoryFn<typeof Heading>

const fontSizes = Object.keys(defaultTheme.fontSizes ?? {})
const fontWeights = Object.keys(defaultTheme.fontWeights ?? {})

const meta: Meta<typeof Heading> = {
  component: Heading,
  title: "Primitive Components / Heading",
  argTypes: {
    as: {
      control: { type: "select" },
      options: Object.keys(DEFAULT_FONT_SIZES),
      description: "The HTML heading level which determines font size and weight",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "h1" },
      },
    },
    children: {
      control: { type: "text" },
      description: "The text content of the heading",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    color: {
      control: { type: "color" },
      description: "The text color of the heading",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    textAlign: {
      control: { type: "select" },
      options: ["left", "center", "right", "justify"],
      description: "Text alignment of the heading",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    fontStyle: {
      control: { type: "select" },
      options: ["normal", "italic", "oblique"],
      description: "Font style of the heading",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    textDecoration: {
      control: { type: "select" },
      options: ["none", "underline", "overline", "line-through"],
      description: "Text decoration of the heading",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    fontSize: {
      control: { type: "select" },
      options: Object.values(fontSizes).concat(Object.values(DEFAULT_FONT_SIZES)),
      description: "The font size of the heading",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
    fontWeight: {
      control: { type: "select" },
      options: Object.values(fontWeights).concat(Object.values(FONT_WEIGHTS)),
      description: "The font weight of the heading",
      table: {
        type: { summary: "string" },
        category: "Styling",
      },
    },
  },
}

export default meta

const variants = Object.keys(DEFAULT_FONT_SIZES)

export const Basic: Story = (args) => {
  return <Heading {...args}>Heading</Heading>
}

export const Variant: Story = (args) => {
  return (
    <PropsTable rows={variants} variant="column">
      {(_, row, key) => {
        return (
          <Heading as={row} key={key} {...args}>
            Heading {row}
          </Heading>
        )
      }}
    </PropsTable>
  )
}

Basic.parameters = {
  docs: {
    description: {
      story: "A basic heading component with default h1 styling",
    },
  },
}

Variant.parameters = {
  docs: {
    description: {
      story: "Demonstrates different heading levels with corresponding font sizes and weights",
    },
  },
}
