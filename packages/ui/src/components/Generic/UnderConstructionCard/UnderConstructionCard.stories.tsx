import type { Meta, StoryFn } from "@storybook/nextjs"
import { Box } from "@yamada-ui/react"
import { UnderConstructionCard } from "./UnderConstructionCard"

const meta: Meta<typeof UnderConstructionCard> = {
  title: "Generic Components / UnderConstructionCard",
  component: UnderConstructionCard,
  argTypes: {
    title: { control: "text", description: "The title to display in the card header" },
    description: {
      control: "text",
      description: "The description text to display in the card body",
    },
  },
}

export default meta
type Story = StoryFn<typeof UnderConstructionCard>

export const Default: Story = (args) => {
  return (
    <Box maxW={{ base: "none", md: "33%" }}>
      <UnderConstructionCard {...args} />
    </Box>
  )
}
