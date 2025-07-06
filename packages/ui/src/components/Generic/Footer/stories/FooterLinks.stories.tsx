import type { Meta, StoryObj } from "@storybook/react"
import { MOCK_LINKS } from "../constants"
import { FooterLinks } from "../FooterLinks"

const meta = {
  title: "Generic Components / Footer / FooterLinks",
  component: FooterLinks,
  tags: ["autodocs"],
} satisfies Meta<typeof FooterLinks>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    links: MOCK_LINKS,
  },
}

export const Custom: Story = {
  args: {
    links: {
      custom1: {
        title: "Custom Links",
        links: [
          { label: "Custom 1", href: "#" },
          { label: "Custom 2", href: "#" },
          { label: "Custom 3", href: "#" },
        ],
      },
      custom2: {
        title: "More Links",
        links: [
          { label: "More 1", href: "#" },
          { label: "More 2", href: "#" },
        ],
      },
    },
  },
}
