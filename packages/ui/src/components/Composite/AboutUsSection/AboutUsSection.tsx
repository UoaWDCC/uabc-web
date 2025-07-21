import { AboutUsCard, type AboutUsCardProps } from "@repo/ui/components/Generic/AboutUsCard"
import {
  AboutUsCarousel,
  type AboutUsCarouselProps,
} from "@repo/ui/components/Generic/AboutUsCarousel"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { Center, Stack, VStack } from "@yamada-ui/react"
import Link from "next/link"

export interface AboutUsSectionProps extends AboutUsCarouselProps {
  cards: AboutUsCardProps[]
}

export const AboutUsSection = ({ cards, ...carouselProps }: AboutUsSectionProps) => {
  return (
    <>
      <Heading.h2 fontSize={{ base: "2xl", md: "6xl" }} fontWeight="semibold" w="full">
        About Us
      </Heading.h2>
      <VStack as={Center} gap="lg">
        <VStack gap="xl">
          <AboutUsCarousel
            data-testid="about-us-carousel"
            floatProps={{ marginX: { sm: "sm", md: "lg" }, marginY: "sm" }}
            wrapperProps={{ paddingX: { sm: "sm", md: "lg" }, paddingY: "sm" }}
            {...carouselProps}
            autoplay
            delay={4000}
            height="auto"
            width="full"
          />
          <Stack flexDir={{ base: "column", md: "row" }} gap={{ base: "lg", lg: "xl" }}>
            {cards.map((card) => (
              <AboutUsCard key={card.title} {...card} />
            ))}
          </Stack>
        </VStack>

        <Button
          as={Link}
          colorScheme="primary"
          href="/about"
          placeSelf="center"
          size="lg"
          w="fit-content"
        >
          Learn More
        </Button>
      </VStack>
    </>
  )
}

AboutUsSection.displayName = "AboutUsSection"
