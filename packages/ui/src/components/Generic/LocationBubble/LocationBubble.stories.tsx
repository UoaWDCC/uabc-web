import type { Meta, StoryFn } from "@storybook/react"
import { Box } from "@yamada-ui/react"
import { LocationBubble } from "."
import { LocationBubbleCircle } from "./LocationBubbleCircle"
import { LocationBubbleDesktopCard } from "./LocationBubbleDesktopCard"
import { LocationBubbleMobileCard } from "./LocationBubbleMobileCard"

type Story = StoryFn<typeof LocationBubble>

const meta: Meta<typeof LocationBubble> = {
  component: LocationBubble,
  title: "Generic Components / LocationBubble",
  argTypes: {
    locationTitle: {
      control: "text",
      description: "Title of the location",
      table: { type: { summary: "string" } },
    },
    locationDetails: {
      control: "text",
      description: "Details about the location (e.g., address)",
      table: { type: { summary: "string" } },
    },
    locationTimes: {
      control: "object",
      description: "Object containing days and times for the location",
      table: { type: { summary: "Record<string, string>" } },
    },
    locationImage: {
      control: "object",
      description: "Props for the location image, including `src` and others",
      table: { type: { summary: "ImageProps" } },
    },
  },
  args: {
    locationTitle: "Uoa Recreation Centre",
    locationImage: {
      src: "https://placehold.co/300x200/png",
      alt: "Placeholder image for location",
    },
    buttonLink: "#",
    locationDetails: "17 Symonds Street",
    locationTimes: {
      Tuesday: "7:30pm - 10pm",
      Friday: "7:30pm - 10pm",
    },
  },
}

export default meta

export const Default: Story = (args) => {
  return <LocationBubble {...args} />
}

export const Circle: Story = (args) => {
  return <LocationBubbleCircle {...args} />
}

export const DesktopCard: Story = (args) => {
  return (
    <Box height="fit-content" width="fit-content">
      <LocationBubbleDesktopCard {...args} />
    </Box>
  )
}

export const MobileCard: Story = (args) => {
  return (
    <Box height="500px" width="480px">
      <LocationBubbleMobileCard {...args} onClose={() => {}} open={true} />
    </Box>
  )
}
