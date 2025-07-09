import { AboutUsCard, type AboutUsCardProps } from "@repo/ui/components/Generic/AboutUsCard"
import {
  AboutUsCarousel,
  type AboutUsCarouselProps,
} from "@repo/ui/components/Generic/AboutUsCarousel"
import { Button, Heading } from "@repo/ui/components/Primitive"
import { Container, Flex, VStack } from "@yamada-ui/react"
import Link from "next/link"

export interface AboutUsSectionProps extends AboutUsCarouselProps {
  cards: AboutUsCardProps[]
}

export const AboutUsSection = ({ cards, ...carouselProps }: AboutUsSectionProps) => {
  return (
    <Container as={VStack} centerContent gap={{ base: "md", md: "xl" }} padding="calc(lg - sm)">
      <Heading.h2 fontSize={{ base: "2xl", md: "6xl" }} fontWeight="semibold" w="full">
        About Us
      </Heading.h2>
      <VStack gap="2xl">
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
        <Flex flexDir={{ base: "column", md: "row" }} gap={{ base: "md", md: "xl" }}>
          {cards.map((card) => (
            <AboutUsCard key={card.title} {...card} />
          ))}
        </Flex>
      </VStack>
      <Button as={Link} colorScheme="primary" href="/about" size="lg">
        Learn More
      </Button>
    </Container>
  )
}

AboutUsSection.displayName = "AboutUsSection"
