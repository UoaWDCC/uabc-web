import { LocationBubble } from "@repo/ui/components/Generic"
import { Image } from "@repo/ui/components/Primitive"
import { Box, Container } from "@yamada-ui/react"

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

export const LocationBubbleSection = () => {
  return (
    <Container
      centerContent
      h="max(50svh, 1150px)"
      layerStyle="container"
      maxH="1150px"
      position="relative"
    >
      <Box left="25%" position="absolute" top="33%" transform="translate(-50%, -50%)" zIndex={25}>
        <LocationBubble {...mockBubble1} />
      </Box>
      <Box left="75%" position="absolute" top="50%" transform="translate(-50%, -50%)" zIndex={25}>
        <LocationBubble {...mockBubble2} />
      </Box>
      <Box left="33%" position="absolute" top="75%" transform="translate(-50%, -50%)" zIndex={25}>
        <LocationBubble {...mockBubble3} />
      </Box>
      <Image
        alt="Person smashing shuttlecock"
        borderTopRadius="3xl"
        h="full"
        height={1000}
        maxW="2000px"
        minH="480px"
        objectFit="cover"
        objectPosition="center"
        placeSelf="center"
        pointerEvents="none"
        position="absolute"
        src="https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?q=80&w=1311&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        top="-3xl"
        userSelect="none"
        w="100svw"
        width={1000}
        z={-1}
      />
    </Container>
  )
}
