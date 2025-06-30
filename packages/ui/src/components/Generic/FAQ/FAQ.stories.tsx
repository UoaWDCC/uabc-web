import {
  createEditorState,
  createHeadingNode,
  createLinkNode,
  createParagraphNode,
  createSimpleTextEditorState,
  createTextNode,
} from "@repo/ui/test-config/mocks/RichText.mock"
import type { Meta, StoryObj } from "@storybook/react"
import { FAQ } from "./FAQ"
import type { FAQItem } from "./schema"

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
        type: { summary: "FAQItem[]" },
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

const sampleFAQItems: FAQItem[] = [
  {
    question: "When will the sessions I bought be loaded onto the portal?",
    answer: createSimpleTextEditorState(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus, justo in pulvinar aliquet, nibh orci rhoncus nibh, eget sollicitudin nisl quam eu ipsum. Duis lacinia justo vel sollicitudin vehicula. Phasellus interdum iaculis ultrices. In viverra vulputate elit, at suscipit leo. Cras sit amet quam eget leo pellentesque tincidunt id tempor purus.",
    ),
  },
  {
    question: "What should I do if I can't log in?",
    answer: createEditorState([
      createParagraphNode([
        createTextNode("If you're having trouble logging in, please try the following steps:"),
      ]),
      createParagraphNode([createTextNode("1. Check your email and password are correct")]),
      createParagraphNode([createTextNode("2. Reset your password if needed")]),
      createParagraphNode([createTextNode("3. Clear your browser cache")]),
      createParagraphNode([createTextNode("4. Contact support if the issue persists")]),
    ]),
  },
  {
    question: "Help me please hello I need to fill this space help lorem ipsum hello ni hao",
    answer: createSimpleTextEditorState(
      "We're here to help! Please provide more details about what you need assistance with, and our support team will get back to you as soon as possible.",
    ),
  },
  {
    question: "When will the sessions I bought be loaded onto the portal?",
    answer: createSimpleTextEditorState(
      "Your purchased sessions typically take 24-48 hours to appear in your portal after payment confirmation. If it's been longer than this, please contact our support team.",
    ),
  },
]

const richTextFAQItems: FAQItem[] = [
  {
    question: "What features does this FAQ component support?",
    answer: createEditorState([
      createHeadingNode("h3", "Rich Text Support"),
      createParagraphNode([
        createTextNode("This FAQ component now supports "),
        createTextNode("rich text formatting", 1),
        createTextNode(" including:"),
      ]),
      createParagraphNode([
        createTextNode("• "),
        createTextNode("Bold", 1),
        createTextNode(" and "),
        createTextNode("italic", 2),
        createTextNode(" text"),
      ]),
      createParagraphNode([
        createTextNode("• Links like "),
        createLinkNode("https://example.com", "this example"),
      ]),
      createParagraphNode([createTextNode("• Headings and structured content")]),
    ]),
  },
  {
    question: "How do I use rich text in FAQ answers?",
    answer: createSimpleTextEditorState(
      "Simply provide a SerializedEditorState object from Payload CMS for the answer field. The component automatically renders all rich text formatting.",
    ),
  },
  {
    question: "Can I include complex formatting?",
    answer: createEditorState([
      createParagraphNode([createTextNode("Yes! You can include complex formatting such as:")]),
      createParagraphNode([createTextNode("• Multiple paragraphs")]),
      createParagraphNode([
        createTextNode("• "),
        createLinkNode("https://example.com", "External links"),
      ]),
      createParagraphNode([
        createTextNode("• "),
        createTextNode("Text formatting", 1),
        createTextNode(" like bold and "),
        createTextNode("italic", 2),
      ]),
      createHeadingNode("h4", "Even headings within answers"),
      createParagraphNode([
        createTextNode("This provides maximum flexibility for content creators."),
      ]),
    ]),
  },
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
      {
        question: "This question is disabled",
        answer: createSimpleTextEditorState("This answer won't be accessible."),
        disabled: true,
      },
      ...sampleFAQItems.slice(2),
    ],
  },
}

export const SingleItem: Story = {
  args: {
    title: "FAQ",
    items: [
      {
        question: "How do I get started?",
        answer: createSimpleTextEditorState(
          "Getting started is easy! Simply create an account, verify your email, and you'll be ready to begin using our platform.",
        ),
      },
    ],
  },
}

export const LongContent: Story = {
  args: {
    title: "FAQ",
    items: [
      {
        question: "What are the detailed terms and conditions?",
        answer: createEditorState([
          createParagraphNode([
            createTextNode(
              "Our terms and conditions are comprehensive and cover all aspects of our service. Here's a detailed breakdown:",
            ),
          ]),
          createHeadingNode("h4", "Key Points:"),
          createParagraphNode([
            createTextNode("1. "),
            createTextNode("Account Creation:", 1),
            createTextNode(" Users must provide accurate information when creating accounts."),
          ]),
          createParagraphNode([
            createTextNode("2. "),
            createTextNode("Payment Terms:", 1),
            createTextNode(" All payments are processed securely through our payment partners."),
          ]),
          createParagraphNode([
            createTextNode("3. "),
            createTextNode("Refund Policy:", 1),
            createTextNode(" Refunds are available within 30 days of purchase for eligible items."),
          ]),
          createParagraphNode([
            createTextNode("4. "),
            createTextNode("Privacy Policy:", 1),
            createTextNode(
              " We take your privacy seriously and follow all applicable data protection laws.",
            ),
          ]),
          createParagraphNode([
            createTextNode("For the complete terms and conditions, please visit our "),
            createLinkNode("/legal", "legal page"),
            createTextNode(
              " or contact our support team for clarification on any specific points.",
            ),
          ]),
        ]),
      },
      {
        question: "Short question with comprehensive answer?",
        answer: createSimpleTextEditorState(
          "Sometimes a simple question requires a comprehensive answer that spans multiple paragraphs and covers various aspects of the topic in great detail.",
        ),
      },
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

export const EmptyState: Story = {
  args: {
    title: "No Questions Yet",
    items: [],
  },
}
