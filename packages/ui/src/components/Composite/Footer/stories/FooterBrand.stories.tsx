import type { Meta, StoryObj } from "@storybook/react"
import { MOCK_SOCIAL_LINKS } from "../constants"
import { FooterBrand } from "../FooterBrand"

const meta = {
  title: "Generic Components / Footer / FooterBrand",
  component: FooterBrand,
  tags: ["autodocs"],
  args: {
    socialLinks: MOCK_SOCIAL_LINKS,
  },
} satisfies Meta<typeof FooterBrand>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "UABC",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  },
}

export const Custom: Story = {
  args: {
    title: "Custom Brand",
    description: "This is a custom brand description.",
  },
}
