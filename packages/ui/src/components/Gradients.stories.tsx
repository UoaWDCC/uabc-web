import { defaultTheme } from "@repo/theme"
import type { Meta, StoryObj } from "@storybook/react"
import { Grid, VStack } from "@yamada-ui/react"
import { ColorPallet } from "../../.storybook/components"
import { Heading } from "./Heading"

const meta: Meta = {
  title: "Theme / Gradients",
  component: VStack,
}

export default meta

type Story = StoryObj<typeof VStack>

const gradients = defaultTheme.gradients as Record<string, string>

export const Colors: Story = {
  render: () => (
    <VStack width="full">
      <Heading.h1>Gradients</Heading.h1>

      <Grid gap="md" templateColumns="repeat(3, 1fr)">
        <ColorPallet name="Primary Gradient" value={gradients.primaryGradient} />
        <ColorPallet name="Secondary Gradient" value={gradients.secondaryGradient} />
        <ColorPallet name="Light Gradient" value={gradients.lightGradient} />
      </Grid>
    </VStack>
  ),
}
