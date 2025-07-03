import { ListType } from "@repo/ui/components/Generic/RichText/lib/constants"
import { createSharedFAQItem, createSimpleSharedFAQItem } from "@repo/ui/test-config/mocks/FAQ.mock"
import {
  createEditorState,
  createHeadingNode,
  createLinkNode,
  createListNode,
  createParagraphNode,
  createTextNode,
} from "@repo/ui/test-config/mocks/RichText.mock"
import type { Meta, StoryObj } from "@storybook/react"
import { FAQ } from "./FAQ"
import type { UIFAQItem } from "./schema"

type Story = StoryObj<typeof FAQ>

const meta: Meta<typeof FAQ> = {
  component: FAQ,
  title: "Generic Components / FAQ",
  argTypes: {
    title: {
      control: "text",
      description: "The title for the FAQ section",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '"FAQs"' },
      },
    },
    allowMultiple: {
      control: "boolean",
      description: "Whether to allow multiple items to be expanded at once",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    allowToggle: {
      control: "boolean",
      description: "Whether to allow toggling (collapsing) expanded items",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    items: {
      control: "object",
      description: "Array of FAQ items to display",
      table: {
        type: { summary: "UIFAQItem[]" },
        defaultValue: { summary: "[]" },
      },
    },
    richTextProps: {
      control: "object",
      description: "Props to pass to RichText components for rich text answers",
      table: {
        type: { summary: "Omit<RichTextProps, 'data'>" },
      },
    },
  },
}

export default meta

const sampleFAQItems: UIFAQItem[] = [
  createSimpleSharedFAQItem(
    "When will the sessions I bought be loaded onto the portal?",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus, justo in pulvinar aliquet, nibh orci rhoncus nibh, eget sollicitudin nisl quam eu ipsum. Duis lacinia justo vel sollicitudin vehicula. Phasellus interdum iaculis ultrices. In viverra vulputate elit, at suscipit leo. Cras sit amet quam eget leo pellentesque tincidunt id tempor purus.",
  ),
  createSharedFAQItem(
    "What should I do if I can't log in?",
    createEditorState([
      createParagraphNode([
        createTextNode("If you're having trouble logging in, please try the following steps:"),
      ]),
      createListNode(ListType.ORDERED, [
        "Check your email and password are correct",
        "Reset your password if needed",
        "Clear your browser cache",
        "Contact support if the issue persists",
      ]),
    ]),
  ),
  createSimpleSharedFAQItem(
    "Help me please hello I need to fill this space help lorem ipsum hello ni hao",
    "We're here to help! Please provide more details about what you need assistance with, and our support team will get back to you as soon as possible.",
  ),
  createSimpleSharedFAQItem(
    "When will the sessions I bought be loaded onto the portal?",
    "Your purchased sessions typically take 24-48 hours to appear in your portal after payment confirmation. If it's been longer than this, please contact our support team.",
  ),
]

const richTextFAQItems: UIFAQItem[] = [
  createSharedFAQItem(
    "What features does this FAQ component support?",
    createEditorState([
      createHeadingNode("h3", "Rich Text Support"),
      createParagraphNode([
        createTextNode("This FAQ component now supports "),
        createTextNode("rich text formatting", 1),
        createTextNode(" including:"),
      ]),
      createListNode(ListType.UNORDERED, [
        "Bold and italic text",
        "Multiple paragraph support",
        "Interactive links and references",
        "Structured headings and content hierarchy",
      ]),
      createParagraphNode([
        createTextNode("You can also include "),
        createLinkNode("https://example.com", "external links"),
        createTextNode(" seamlessly within your content."),
      ]),
    ]),
  ),
  createSimpleSharedFAQItem(
    "How do I use rich text in FAQ answers?",
    "Simply provide a SerializedEditorState object from Payload CMS for the answer field. The component automatically renders all rich text formatting.",
  ),
  createSharedFAQItem(
    "Can I include complex formatting?",
    createEditorState([
      createParagraphNode([
        createTextNode("Absolutely! You can create sophisticated content with:"),
      ]),
      createListNode(ListType.ORDERED, [
        "Nested content structures",
        "Custom styling and emphasis",
        "Mixed media references",
      ]),
      createHeadingNode("h4", "Advanced Content Organization"),
      createParagraphNode([
        createTextNode("This provides maximum flexibility for content creators to build "),
        createLinkNode("/docs", "comprehensive documentation"),
        createTextNode(" and detailed explanations."),
      ]),
    ]),
  ),
]

export const Basic: Story = {
  args: {
    title: "FAQ",
    items: sampleFAQItems,
  },
}

export const AllowMultiple: Story = {
  args: {
    title: "FAQ",
    items: sampleFAQItems,
    allowMultiple: true,
  },
}

export const NoToggle: Story = {
  args: {
    title: "FAQ",
    items: sampleFAQItems,
    allowToggle: false,
  },
}

export const WithDisabledItem: Story = {
  args: {
    title: "FAQ",
    items: [
      ...sampleFAQItems.slice(0, 2),
      createSimpleSharedFAQItem("This question is disabled", "This answer won't be accessible.", {
        disabled: true,
      }),
      ...sampleFAQItems.slice(2),
    ],
  },
}

export const SingleItem: Story = {
  args: {
    title: "FAQ",
    items: [
      createSimpleSharedFAQItem(
        "How do I get started?",
        "Getting started is easy! Simply create an account, verify your email, and you'll be ready to begin using our platform.",
      ),
    ],
  },
}

export const LongContent: Story = {
  args: {
    title: "FAQ",
    items: [
      createSharedFAQItem(
        "What are the detailed terms and conditions?",
        createEditorState([
          createParagraphNode([
            createTextNode(
              "Our terms and conditions are comprehensive and cover all aspects of our service. Here's a detailed breakdown:",
            ),
          ]),
          createHeadingNode("h4", "Key Points:"),
          createListNode(ListType.ORDERED, [
            "Account Creation: Users must provide accurate information when creating accounts.",
            "Payment Terms: All payments are processed securely through our payment partners.",
            "Refund Policy: Refunds are available within 30 days of purchase for eligible items.",
            "Privacy Policy: We take your privacy seriously and follow all applicable data protection laws.",
          ]),
          createParagraphNode([
            createTextNode("For the complete terms and conditions, please visit our "),
            createLinkNode("/legal", "legal page"),
            createTextNode(
              " or contact our support team for clarification on any specific points.",
            ),
          ]),
        ]),
      ),
      createSimpleSharedFAQItem(
        "Short question with comprehensive answer?",
        "Sometimes a simple question requires a comprehensive answer that spans multiple paragraphs and covers various aspects of the topic in great detail.",
      ),
    ],
  },
}

export const RichTextFeatures: Story = {
  args: {
    title: "Rich Text Capabilities",
    items: richTextFAQItems,
    allowMultiple: true,
  },
}
