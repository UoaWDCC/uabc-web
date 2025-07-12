import { AboutUsSection } from "@repo/ui/components/Composite/AboutUsSection"
import {
  FAQ,
  LocationBubble,
  type LocationBubbleProps,
  QuickBook,
} from "@repo/ui/components/Generic"
import { locationAndTimeOptionsMock } from "@repo/ui/components/Generic/QuickBook/QuickBook.mock"
import { Heading, Image } from "@repo/ui/components/Primitive"
import { Bleed, Box, Center, Text, VStack } from "@yamada-ui/react"
import { getFaq } from "@/lib/api/endpoints"

export default async function Home() {
  //  TODO: Discuss with team if we want to fail the build if faq is not found
  const { data: faq } = await getFaq()

  // TODO: replace mock data with real data
  const mockCards = [
    {
      title: "Who We Are",
      description:
        "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
    },
    {
      title: "Who We Is",
      description:
        "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
    },
    {
      title: "Who I Is",
      description:
        "UABC Badminton Club is the official badminton team of UOA, bringing together students who love the game — from absolute beginners to competitive players.",
    },
  ]

  const mockItems = [
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
  ]

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
    <VStack gap="2xl" maxW="1220px">
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
      <Box zIndex={2}>
        <QuickBook locationAndTimeOptions={locationAndTimeOptionsMock} />
      </Box>
      <Bleed as={Center} blockStart={{ base: "4xl", md: "3xl" }} inline="full">
        <Box h="full" maxH="1150px" position="relative" w="full">
          <Image
            alt="Person smashing shuttlecock"
            borderTopRadius="3xl"
            h="100%"
            height={600}
            minH="480px"
            objectFit="cover"
            objectPosition="center"
            position="relative"
            src="https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=1311&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            w="100%"
            width={400}
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
        </Box>
      </Bleed>
      <AboutUsSection cards={mockCards} items={mockItems} />
      <Box marginY="2xl">
        <FAQ
          items={faq?.data?.questions ?? []}
          richTextProps={{ mediaBaseUrl: process.env.NEXT_PUBLIC_API_URL }}
        />
      </Box>
    </VStack>
  )
}
