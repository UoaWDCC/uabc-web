import type { Meta, StoryObj } from "@storybook/react"
import { MOCK_SOCIAL_LINKS } from "../constants"
import { FooterSocialLinks } from "../FooterSocialLinks"

const meta = {
  title: "Generic Components / Footer / FooterSocialLinks",
  component: FooterSocialLinks,
  tags: ["autodocs"],
} satisfies Meta<typeof FooterSocialLinks>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    links: MOCK_SOCIAL_LINKS,
  },
}
