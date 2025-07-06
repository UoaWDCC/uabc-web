import type { Meta, StoryObj } from "@storybook/react"
import { Footer } from ".."

const meta = {
  title: "Generic Components / Footer / Footer",
  component: Footer,
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllProps: Story = {
  args: {
    brand: {
      title: "UABC Story",
      description: "This is a storybook version of the footer.",
    },
    bottom: {
      copyrightName: "UABC Storybook",
      credits: "Developed by Storybook",
    },
    links: {
      custom1: {
        title: "Story Links",
        links: [
          { label: "Story 1", href: "#" },
          { label: "Story 2", href: "#" },
        ],
      },
      custom2: {
        title: "Book Links",
        links: [
          { label: "Book 1", href: "#" },
          { label: "Book 2", href: "#" },
        ],
      },
    },
    decoration: undefined,
  },
}
