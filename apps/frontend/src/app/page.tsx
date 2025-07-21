import {
  GridBackground,
  LocationBubble,
  type LocationBubbleProps,
  QuickBook,
} from "@repo/ui/components/Generic"
import { locationAndTimeOptionsMock } from "@repo/ui/components/Generic/QuickBook/QuickBook.mock"
import { Heading, Image } from "@repo/ui/components/Primitive"
import { Bleed, Box, Center, Text, VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { FaqSection } from "@/components/client/FaqSection"
import { AboutUsServerSection } from "@/components/server/AboutUsServerSection"

export const metadata: Metadata = {
  title: "Home | UABC",
  description:
    "Welcome to the homepage of UABC, New Zealand's largest student badminton club. We run weekly badminton sessions and fun social events to connect like-minded badminton people!",
}

export default async function Home() {
  const mockBubble1: LocationBubbleProps = {
    locationImage: {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
      alt: "Badminton court",
    },
    locationTitle: "Uoa Recreation Centre",
    locationDetails: "17 Symonds Street",
    locationTimes: {
      Tuesday: "7:30pm - 10pm",
      Friday: "7:30pm - 10pm",
    },
  }

  const mockBubble2: LocationBubbleProps = {
    locationImage: {
      src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600",
      alt: "Badminton court",
    },
    locationTitle: "Kings College",
    locationDetails: "17 Symonds Street",
    locationTimes: {
      Tuesday: "7:30pm - 10pm",
      Friday: "7:30pm - 10pm",
    },
  }

  const mockBubble3: LocationBubbleProps = {
    locationImage: {
      src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600",
      alt: "Badminton court",
    },
    locationTitle: "Auckland Badminton",
    locationDetails: "17 Symonds Street",
    locationTimes: {
      Tuesday: "7:30pm - 10pm",
      Friday: "7:30pm - 10pm",
    },
  }

  return (
    <VStack gap="2xl" layerStyle="wrapper">
      <GridBackground />
      <VStack
        align="center"
        bgClip="text"
        bgGradient="textGradient"
        gap={{ base: "lg", md: "xl" }}
        paddingTop="lg"
      >
        <VStack align="center" gap={{ base: "md", md: "lg" }}>
          <Text fontSize={{ base: "sm", md: "xl" }} textAlign="center">
            UNIVERSITY OF AUCKLAND BADMINTON CLUB
          </Text>
          <Heading.h1 fontSize={{ base: "6xl", md: "8xl" }} fontWeight="bold" textAlign="center">
            <Text>We are UABC.</Text>
            <Text>NZ's Largest Student</Text>
            <Text color="primary">Badminton Club.</Text>
          </Heading.h1>
        </VStack>
        <Text fontSize={{ base: "md", md: "3xl" }} textAlign="center">
          We run weekly badminton sessions and fun social events to connect like-minded badminton
          people! Join our sessions or check our Instagram page for events! 🏸
        </Text>
      </VStack>
      <QuickBook locationAndTimeOptions={locationAndTimeOptionsMock} />
      <Bleed as={Center} blockStart={{ base: "4xl", md: "3xl" }} inline="full">
        <Center h="full" maxH="1150px" overflowY="clip" position="relative" w="full">
          <Image
            alt="Person smashing shuttlecock"
            borderTopRadius="3xl"
            h="full"
            height={600}
            maxH="1150px"
            maxW="2000px"
            minH="480px"
            objectFit="cover"
            objectPosition="center"
            placeSelf="center"
            position="relative"
            src="https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=1311&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            w="full"
            width={400}
            z={-1}
          />
          <Box
            left="25%"
            position="absolute"
            top="33%"
            transform="translate(-50%, -50%)"
            zIndex={25}
          >
            <LocationBubble {...mockBubble1} />
          </Box>
          <Box
            left="75%"
            position="absolute"
            top="50%"
            transform="translate(-50%, -50%)"
            zIndex={25}
          >
            <LocationBubble {...mockBubble2} />
          </Box>
          <Box
            left="33%"
            position="absolute"
            top="75%"
            transform="translate(-50%, -50%)"
            zIndex={25}
          >
            <LocationBubble {...mockBubble3} />
          </Box>
        </Center>
      </Bleed>
      <AboutUsServerSection />
      <FaqSection />
    </VStack>
  )
}

Home.displayName = "Home"
