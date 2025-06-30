import {
  allFormattingEditorState,
  storyBasicData,
  storyComplexData,
} from "@repo/ui/test-config/mocks/RichText.mock"
import type { Meta, StoryObj } from "@storybook/react"
import { Container } from "@yamada-ui/react"
import { RichText } from "./RichText"

const meta: Meta<typeof RichText> = {
  title: "Components / RichText",
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

export const Basic: Story = {
  args: {
    data: storyBasicData,
  },
  render: (args) => (
    <Container gap="md" maxW="4xl" py="xl">
      <RichText {...args} />
    </Container>
  ),
}

export const Complex: Story = {
  args: {
    data: storyComplexData,
  },
  render: (args) => (
    <Container gap="md" maxW="4xl" py="xl">
      <RichText {...args} />
    </Container>
  ),
}

export const WithCustomProps: Story = {
  args: {
    data: storyComplexData,
    textProps: { color: "gray.600", lineHeight: "relaxed" },
    headingProps: { color: "purple.600" },
    linkProps: { color: "blue.500", _hover: { color: "blue.600" } },
  },
  render: (args) => (
    <Container gap="md" maxW="4xl" py="xl">
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
    data: allFormattingEditorState,
  },
  render: (args) => (
    <Container gap="md" maxW="4xl" py="xl">
      <RichText {...args} />
    </Container>
  ),
}
