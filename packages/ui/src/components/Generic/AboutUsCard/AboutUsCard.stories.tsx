import type { Meta, StoryFn } from "@storybook/nextjs-vite"
import { Box } from "@yamada-ui/react"
import { AboutUsCard } from "./AboutUsCard"

const meta: Meta<typeof AboutUsCard> = {
  title: "Generic Components / AboutUsCard",
  component: AboutUsCard,
  argTypes: {
    title: { control: "text", description: "The components heading title" },
    description: { control: "text", description: "The components description" },
  },
  args: {
    title: "Who We Are",
    description:
      "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
  },
}

export default meta
type Story = StoryFn<typeof AboutUsCard>

export const Default: Story = (args) => {
  return (
    <Box maxW={{ base: "none", md: "33%" }}>
      <AboutUsCard {...args} />
    </Box>
  )
}
