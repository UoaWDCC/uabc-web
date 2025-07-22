import type { Meta, StoryObj } from "@storybook/react"
import { MOCK_SOCIAL_LINKS } from "../constants"
import { FooterBottom } from "../FooterBottom"

const meta = {
  title: "Generic Components / Footer / FooterBottom",
  component: FooterBottom,
  tags: ["autodocs"],
  args: {
    socialLinks: MOCK_SOCIAL_LINKS,
  },
} satisfies Meta<typeof FooterBottom>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    copyrightName: "University of Auckland Badminton Club",
    credits: "Developed by the 2025 WDCC UABC Team",
  },
}

export const Custom: Story = {
  args: {
    copyrightName: "Custom Copyright",
    credits: "Developed by a custom team",
  },
}
