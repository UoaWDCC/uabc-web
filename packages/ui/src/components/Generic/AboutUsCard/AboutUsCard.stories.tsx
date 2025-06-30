import type { Meta, StoryObj } from "@storybook/nextjs"
import { AboutUsCard } from "./AboutUsCard"

const meta: Meta<typeof AboutUsCard> = {
  title: "Generic Components / AboutUsCard",
  component: AboutUsCard,
  argTypes: {
    title: { control: "text", description: "The components heading title" },
    description: { control: "text", description: "The components description" },
  },
}

export default meta
type Story = StoryObj<typeof AboutUsCard>

export const Default: Story = {
  args: {
    title: "Who We Are",
    description:
      "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
  },
}
