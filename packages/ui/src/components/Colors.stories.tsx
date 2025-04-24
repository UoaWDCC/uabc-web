import { Heading } from "@/components/Heading"
import { defaultTheme } from "@repo/theme"
import { COLORS } from "@repo/theme/tokens"
import type { Meta, StoryObj } from "@storybook/react"
import { Grid, VStack } from "@yamada-ui/react"
import { ColorPallet, ColorPallets } from "../../.storybook/components"

const meta: Meta = {
  title: "Theme / Colors",
  component: VStack,
}

export default meta

type Story = StoryObj<typeof VStack>

export const Colors: Story = {
  render: () => (
    <VStack width="full">
      <Heading.h1>Colors</Heading.h1>

      <Heading.h2>Black & White</Heading.h2>
      <Grid templateColumns="repeat(3, 1fr)" gap="md">
        <ColorPallet name="white" value={defaultTheme.colors.white} />
        <ColorPallet name="black" value={defaultTheme.colors.black} />
      </Grid>

      <Heading.h2>Semantics</Heading.h2>
      <Grid templateColumns="repeat(3, 1fr)" gap="md">
        <ColorPallet name="primary" value={defaultTheme.semantics.colors.primary} />
        <ColorPallet name="secondary" value={defaultTheme.semantics.colors.secondary} />
        <ColorPallet name="info" value={defaultTheme.semantics.colors.info} />
        <ColorPallet name="success" value={defaultTheme.semantics.colors.success} />
        <ColorPallet name="warning" value={defaultTheme.semantics.colors.warning} />
        <ColorPallet name="danger" value={defaultTheme.semantics.colors.danger} />
        <ColorPallet name="link" value={defaultTheme.semantics.colors.link} />
        <ColorPallet name="muted" value={defaultTheme.semantics.colors.muted} />
      </Grid>

      <Heading.h2>Alphas</Heading.h2>
      <Grid templateColumns="repeat(3, 1fr)" gap="md">
        <ColorPallets name="whiteAlpha" colors={defaultTheme.colors} />
      </Grid>
      <Grid templateColumns="repeat(3, 1fr)" gap="md">
        <ColorPallets name="blackAlpha" colors={defaultTheme.colors} />
      </Grid>

      {COLORS.map((colorName) => (
        <VStack key={colorName} width="full">
          <Heading.h2>{colorName.charAt(0).toUpperCase() + colorName.slice(1)}</Heading.h2>
          <Grid templateColumns="repeat(3, 1fr)" gap="md">
            <ColorPallets name={colorName.toLowerCase()} colors={defaultTheme.colors} />
          </Grid>
        </VStack>
      ))}
    </VStack>
  ),
}
