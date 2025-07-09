import type { Meta, StoryObj } from "@storybook/react"
import { AboutUsSection } from "./AboutUsSection"

const meta: Meta<typeof AboutUsSection> = {
  title: "Generic Components / AboutUsSection",
  component: AboutUsSection,
  argTypes: {
    cards: {
      control: "object",
      description: "Array of AboutUsCardProps to display in the section",
      table: {
        type: { summary: "AboutUsCardProps[]" },
        defaultValue: { summary: "[]" },
      },
    },
    items: {
      control: "object",
      description: "Array of items for the AboutUsCarousel",
      table: {
        type: { summary: "AboutUsCarouselProps['items']" },
        defaultValue: { summary: "[]" },
      },
    },
  },
  args: {
    items: [
      {
        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
        alt: "Mountain Lake",
        width: 600,
        height: 400,
        emoji: "😄",
      },
      {
        src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600",
        alt: "Forest Path",
        width: 600,
        height: 400,
        emoji: "😁",
      },
      {
        src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600",
        alt: "Desert Dunes",
        width: 600,
        height: 400,
        emoji: "😆",
      },
    ],
    cards: [
      {
        title: "Who We Are",
        description:
          "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
      },
      {
        title: "Who We Are",
        description:
          "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
      },
      {
        title: "Who We Are",
        description:
          "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof AboutUsSection>

export const Default: Story = {}
