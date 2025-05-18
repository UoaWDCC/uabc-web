import { defaultTheme } from "@repo/theme"
import type { Meta, StoryObj } from "@storybook/react"
import { Grid, VStack } from "@yamada-ui/react"
import { GradientPallet } from "../../.storybook/components"
import { Heading } from "./Heading"

const meta: Meta = {
  title: "Theme / Gradients",
  component: VStack,
}

export default meta

type Story = StoryObj<typeof VStack>

const gradients = defaultTheme.gradients as Record<string, string>

export const Gradients: Story = {
  render: () => (
    <VStack width="full">
      <Heading.h1>Gradients</Heading.h1>

      <Grid gap="md" templateColumns="repeat(3, 1fr)">
        <GradientPallet gradient={gradients.primaryGradient} name="Primary Gradient" />
        <GradientPallet gradient={gradients.secondaryGradient} name="Secondary Gradient" />
        <GradientPallet gradient={gradients.lightGradient} name="Light Gradient" />
      </Grid>
    </VStack>
  ),
}
