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
      linkGroup1: {
        title: "Story Links",
        links: [
          { label: "Story 1", url: "#" },
          { label: "Story 2", url: "#" },
        ],
      },
      linkGroup2: {
        title: "Book Links",
        links: [
          { label: "Book 1", url: "#" },
          { label: "Book 2", url: "#" },
        ],
      },
    },
    decoration: undefined,
  },
}
