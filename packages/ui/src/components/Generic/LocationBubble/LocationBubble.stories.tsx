import type { Meta, StoryFn } from "@storybook/react"
import { Box } from "@yamada-ui/react"
import dayjs from "dayjs"
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
    button: {
      control: "object",
      description: "Button configuration with `label` and `url` properties",
      table: { type: { summary: "{ label?: string; url?: string }" } },
    },
  },
  args: {
    locationTitle: "Uoa Recreation Centre",
    locationImage: {
      src: "https://placehold.co/300x200/png",
      alt: "Placeholder image for location",
    },
    locationDetails: "17 Symonds Street",
    locationTimes: {
      Tuesday: [new Date(1970, 1, 1, 10).toISOString(), new Date(1970, 1, 1, 11).toISOString()],
      Friday: [
        new Date(1970, 1, 1, 10, 30).toISOString(),
        new Date(1970, 1, 1, 11, 30).toISOString(),
      ],
    },
    button: {
      label: "Learn more",
      url: "#",
    },
  },
}

export default meta

export const Default: Story = (args) => {
  return (
    <Box left="25%" position="absolute" top="50%" transform="translate(-50%, -50%)">
      <LocationBubble {...args} />
    </Box>
  )
}

export const Circle: Story = (args) => {
  return <LocationBubbleCircle {...args} />
}

export const DesktopCard: Story = (args) => {
  const locationTimes = Object.entries(args.locationTimes || {}).reduce(
    (acc, [day, times]) => {
      if (Array.isArray(times) && times.length >= 2) {
        acc[day] = [dayjs(times[0]).format("h:mmA"), dayjs(times[1]).format("h:mmA")]
      }
      return acc
    },
    {} as Record<string, string[]>,
  )
  return (
    <Box height="fit-content" width="fit-content">
      <LocationBubbleDesktopCard {...args} locationTimes={locationTimes} />
    </Box>
  )
}

export const MobileCard: Story = (args) => {
  const locationTimes = Object.entries(args.locationTimes || {}).reduce(
    (acc, [day, times]) => {
      if (Array.isArray(times) && times.length >= 2) {
        acc[day] = [dayjs(times[0]).format("h:mmA"), dayjs(times[1]).format("h:mmA")]
      }
      return acc
    },
    {} as Record<string, string[]>,
  )
  return (
    <Box height="500px" width="480px">
      <LocationBubbleMobileCard
        {...args}
        locationTimes={locationTimes}
        onClose={() => {}}
        open={true}
      />
    </Box>
  )
}
