import type { Meta, StoryObj } from "@storybook/react"
import { Footer } from ".."
import { MOCK_SOCIAL_LINKS } from "../constants"

const meta = {
  title: "Generic Components / Footer / Footer",
  component: Footer,
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    socialLinks: MOCK_SOCIAL_LINKS,
    links: {
      linkGroup1: {
        title: "Quick Links",
        links: [
          { label: "Home", url: "/" },
          { label: "Book a Court", url: "/book" },
          { label: "Events", url: "/events" },
        ],
      },
      linkGroup2: {
        title: "UABC",
        links: [
          { label: "About Us", url: "/about" },
          { label: "Contact Us", url: "/contact" },
          { label: "FAQs", url: "/faq" },
        ],
      },
    },
  },
}

export const AllProps: Story = {
  args: {
    brand: {
      title: "UABC Story",
      description: "This is a storybook version of the footer.",
    },
    bottomProps: {
      copyrightName: "UABC Storybook",
      credits: "Developed by Storybook",
    },
    socialLinks: MOCK_SOCIAL_LINKS,
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
