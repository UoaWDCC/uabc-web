import type { Meta, StoryObj } from "@storybook/react"
import { Container } from "@yamada-ui/react"
import { RichText } from "./RichText"
import type { SerializedEditorState } from "./lib/types"

const meta: Meta<typeof RichText> = {
  title: "Components / RichTextRenderer",
  component: RichText,
  argTypes: {
    data: {
      description: "The rich text data from Payload CMS",
      control: { type: "object" },
    },
    fallback: {
      description: "Fallback content when data is not available",
      control: { type: "text" },
    },
    textProps: {
      description: "Props to pass to Text components",
      control: { type: "object" },
    },
    headingProps: {
      description: "Props to pass to Heading components",
      control: { type: "object" },
    },
    linkProps: {
      description: "Props to pass to Link components",
      control: { type: "object" },
    },
    imageProps: {
      description: "Props to pass to Image components",
      control: { type: "object" },
    },
  },
}

export default meta
type Story = StoryObj<typeof RichText>

// Sample rich text data for stories
const basicRichTextData = {
  root: {
    children: [
      {
        type: "heading",
        tag: "h1",
        version: 1,
        children: [
          {
            type: "text",
            text: "Welcome to UABC",
            version: 1,
          },
        ],
      },
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            text: "This is a ",
            version: 1,
          },
          {
            type: "text",
            text: "sample paragraph",
            format: 1, // Bold
            version: 1,
          },
          {
            type: "text",
            text: " with some formatted text.",
            version: 1,
          },
        ],
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}

const complexRichTextData = {
  root: {
    children: [
      {
        type: "heading",
        tag: "h2",
        version: 1,
        children: [
          {
            type: "text",
            text: "FAQ Section",
            version: 1,
          },
        ],
      },
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            text: "Here's some content with a ",
            version: 1,
          },
          {
            type: "link",
            fields: {
              linkType: "custom",
              url: "https://example.com",
              newTab: true,
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "custom link",
                version: 1,
              },
            ],
          },
          {
            type: "text",
            text: " and some ",
            version: 1,
          },
          {
            type: "text",
            text: "italic text",
            format: 2, // Italic
            version: 1,
          },
          {
            type: "text",
            text: ".",
            version: 1,
          },
        ],
      },
      {
        type: "list",
        tag: "ul",
        version: 1,
        children: [
          {
            type: "listitem",
            version: 1,
            children: [
              {
                type: "text",
                text: "First list item",
                version: 1,
              },
            ],
          },
          {
            type: "listitem",
            version: 1,
            children: [
              {
                type: "text",
                text: "Second list item with ",
                version: 1,
              },
              {
                type: "text",
                text: "code",
                format: 16, // Code
                version: 1,
              },
            ],
          },
        ],
      },
      {
        type: "quote",
        version: 1,
        children: [
          {
            type: "text",
            text: "This is a blockquote with some inspirational text.",
            format: 2, // Italic
            version: 1,
          },
        ],
      },
      {
        type: "horizontalrule",
        version: 1,
      },
      {
        type: "paragraph",
        version: 1,
        children: [
          {
            type: "text",
            text: "Contact us at ",
            version: 1,
          },
          {
            type: "link",
            fields: {
              linkType: "custom",
              url: "mailto:info@uabc.co.nz",
            },
            version: 1,
            children: [
              {
                type: "text",
                text: "info@uabc.co.nz",
                format: 16, // Code
                version: 1,
              },
            ],
          },
        ],
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
}

export const Basic: Story = {
  args: {
    data: basicRichTextData as SerializedEditorState,
  },
  render: (args) => (
    <Container maxW="4xl" py="xl">
      <RichText {...args} />
    </Container>
  ),
}

export const Complex: Story = {
  args: {
    data: complexRichTextData,
  },
  render: (args) => (
    <Container maxW="4xl" py="xl">
      <RichText {...args} />
    </Container>
  ),
}

export const WithCustomProps: Story = {
  args: {
    data: complexRichTextData,
    textProps: { color: "gray.600", lineHeight: "relaxed" },
    headingProps: { color: "purple.600" },
    linkProps: { color: "blue.500", _hover: { color: "blue.600" } },
  },
  render: (args) => (
    <Container maxW="4xl" py="xl">
      <RichText {...args} />
    </Container>
  ),
}

export const WithFallback: Story = {
  args: {
    data: undefined,
    fallback: "No content available at this time.",
  },
  render: (args) => (
    <Container maxW="4xl" py="xl">
      <RichText {...args} />
    </Container>
  ),
}

export const AllFormattingTypes: Story = {
  args: {
    data: {
      root: {
        children: [
          {
            type: "heading",
            tag: "h1",
            version: 1,
            children: [{ type: "text", text: "All Formatting Types", version: 1 }],
          },
          {
            type: "paragraph",
            version: 1,
            children: [
              { type: "text", text: "Normal text, ", version: 1 },
              { type: "text", text: "bold text", format: 1, version: 1 },
              { type: "text", text: ", ", version: 1 },
              { type: "text", text: "italic text", format: 2, version: 1 },
              { type: "text", text: ", ", version: 1 },
              { type: "text", text: "strikethrough", format: 4, version: 1 },
              { type: "text", text: ", ", version: 1 },
              { type: "text", text: "underlined", format: 8, version: 1 },
              { type: "text", text: ", and ", version: 1 },
              { type: "text", text: "code text", format: 16, version: 1 },
              { type: "text", text: ".", version: 1 },
            ],
          },
          {
            type: "list",
            tag: "ol",
            version: 1,
            children: [
              {
                type: "listitem",
                version: 1,
                children: [{ type: "text", text: "Ordered list item 1", version: 1 }],
              },
              {
                type: "listitem",
                version: 1,
                children: [{ type: "text", text: "Ordered list item 2", version: 1 }],
              },
            ],
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    } as unknown as SerializedEditorState,
  },
  render: (args) => (
    <Container maxW="4xl" py="xl">
      <RichText {...args} />
    </Container>
  ),
}
