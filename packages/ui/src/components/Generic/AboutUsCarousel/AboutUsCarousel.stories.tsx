import type { Meta, StoryFn } from "@storybook/nextjs"
import { Center, Container } from "@yamada-ui/react"
import { AboutUsCarousel } from "./AboutUsCarousel"

const meta: Meta<typeof AboutUsCarousel> = {
  title: "Generic Components / AboutUsCarousel",
  component: AboutUsCarousel,
}

export default meta
type Story = StoryFn<typeof AboutUsCarousel>

export const Default: Story = () => {
  return (
    <Container maxW="3xl" px="md">
      <AboutUsCarousel
        items={[
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
        ]}
      />
    </Container>
  )
}

export const WithAutoplay: Story = () => {
  return (
    <Container maxW="3xl" px="md">
      <AboutUsCarousel
        autoplay
        delay={2000}
        items={[
          {
            src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
            alt: "Mountain View",
            width: 600,
            height: 400,
            emoji: "😃",
          },
          {
            src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
            alt: "Forest Trail",
            width: 600,
            height: 400,
            emoji: "😂",
          },
          {
            src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
            alt: "Ocean Waves",
            width: 600,
            height: 400,
            emoji: "🙂",
          },
        ]}
      />
    </Container>
  )
}

export const CustomizedControls: Story = () => {
  return (
    <Container maxW="3xl" px="md">
      <AboutUsCarousel
        controlProps={{
          bg: "primary",
          color: "white",
          _hover: { bg: "primary.600" },
        }}
        indicatorsProps={{
          component: ({ selected }) => (
            <Center
              _hover={{ transform: "scale(1.1)" }}
              bg={selected ? "primary" : "gray.300"}
              cursor="pointer"
              h="4"
              rounded="full"
              transition="all 0.2s"
              w="4"
            />
          ),
        }}
        items={[
          {
            src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
            alt: "Mountain Lake",
            width: 600,
            height: 400,
            emoji: "😊",
          },
          {
            src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600",
            alt: "Forest Path",
            width: 600,
            height: 400,
            emoji: "🙂",
          },
          {
            src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600",
            alt: "Desert Dunes",
            width: 600,
            height: 400,
            emoji: "😋",
          },
        ]}
        withControls={true}
        withIndicators={true}
      />
    </Container>
  )
}

export const CustomEmojiIcon: Story = () => {
  return (
    <Container maxW="3xl" px="md">
      <AboutUsCarousel
        floatProps={{
          placement: "start-start",
          offset: 4,
        }}
        iconProps={{
          bgGradient: "primaryGradient",
          fontSize: "3xl",
          color: "white",
          shadow: "lg",
        }}
        items={[
          {
            src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
            alt: "Mountain Lake",
            width: 600,
            height: 400,
            emoji: "😎",
          },
          {
            src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600",
            alt: "Forest Path",
            width: 600,
            height: 400,
            emoji: "🥰",
          },
        ]}
      />
    </Container>
  )
}

export const NoControls: Story = () => {
  return (
    <Container maxW="3xl" px="md">
      <AboutUsCarousel
        draggable={true}
        items={[
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
            emoji: "😆",
          },
          {
            src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600",
            alt: "Desert Dunes",
            width: 600,
            height: 400,
            emoji: "😁",
          },
        ]}
        withControls={false}
        withIndicators={false}
      />
    </Container>
  )
}
