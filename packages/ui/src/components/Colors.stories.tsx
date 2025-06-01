import { defaultTheme } from "@repo/theme"
import { COLORS } from "@repo/theme/tokens"
import type { Meta, StoryObj } from "@storybook/react"
import { Grid, VStack } from "@yamada-ui/react"
import { ColorPallet, ColorPallets } from "../../.storybook/components"
import { Heading } from "./Heading"

const meta: Meta = {
  title: "Theme / Colors",
  component: VStack,
}

export default meta

type Story = StoryObj<typeof VStack>

const colors = defaultTheme.colors as Record<string, string>

export const Colors: Story = {
  render: () => (
    <VStack width="full">
      <Heading.h1>Colors</Heading.h1>

      <Heading.h2>Black & White</Heading.h2>
      <Grid gap="md" templateColumns="repeat(3, 1fr)">
        <ColorPallet name="white" value={colors.white} />
        <ColorPallet name="black" value={colors.black} />
      </Grid>

      <Heading.h2>Semantics</Heading.h2>
      <Grid gap="md" templateColumns="repeat(3, 1fr)">
        <ColorPallet name="primary" value={colors.primary} />
        <ColorPallet name="secondary" value={colors.secondary} />
        <ColorPallet name="success" value={colors.success} />
        <ColorPallet name="warning" value={colors.warning} />
        <ColorPallet name="danger" value={colors.danger} />
      </Grid>

      {COLORS.map((colorName) => (
        <VStack key={colorName} width="full">
          <Heading.h2>{colorName.charAt(0).toUpperCase() + colorName.slice(1)}</Heading.h2>
          <Grid gap="md" templateColumns="repeat(3, 1fr)">
            <ColorPallets colors={colors} name={colorName.toLowerCase()} />
          </Grid>
        </VStack>
      ))}
    </VStack>
  ),
}
