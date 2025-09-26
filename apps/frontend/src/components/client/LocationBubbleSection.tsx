import type { LocationBubbleItem, Media } from "@repo/shared/payload-types"
import type { GameSessionSchedule } from "@repo/shared/types"
import { LocationBubble, type LocationBubbleProps } from "@repo/ui/components/Generic"
import { Image } from "@repo/ui/components/Primitive"
import { Box, Container } from "@yamada-ui/react"
import locationBubbleImage from "@/assets/images/DSC9269.webp"

interface LocationBubbleSectionProps {
  locationBubbleItems: LocationBubbleItem
}

export const LocationBubbleSection = ({ locationBubbleItems }: LocationBubbleSectionProps) => {
  const locationBubbles: LocationBubbleProps[] = locationBubbleItems.map((item) => ({
    locationImage: {
      src: (item.locationImage as Media)?.url || "",
      alt: (item.locationImage as Media)?.alt || "Location Image",
    },
    locationTitle: (item.gameSessionSchedule[0] as GameSessionSchedule)?.name || "UABC",
    locationDetails: (item.gameSessionSchedule[0] as GameSessionSchedule)?.location,
    locationTimes: item.gameSessionSchedule.reduce(
      (acc: Record<string, string[]>, curr) => {
        const schedule = curr as GameSessionSchedule
        if (schedule.day && schedule.startTime && schedule.endTime) {
          acc[schedule.day] = [schedule.startTime, schedule.endTime]
        }
        return acc
      },
      {} as Record<string, string[]>,
    ),
    button: item.button,
  }))
  const positions = [
    { left: "25%", top: "33%" },
    { left: "75%", top: "50%" },
    { left: "33%", top: "75%" },
  ]

  return (
    <Container
      centerContent
      layerStyle="container"
      minH={{ base: "3xl", md: "5xl" }}
      position="relative"
      top="-3xl"
    >
      {locationBubbles.map((item, index) => (
        <Box
          key={`location-bubble-${item.locationTitle}`}
          position="absolute"
          transform="translate(-50%, -50%)"
          zIndex={25}
          {...positions[index]}
        >
          <LocationBubble {...item} />
        </Box>
      ))}
      <Image
        alt="Person smashing shuttlecock"
        borderTopRadius="3xl"
        h={{ base: "3xl", md: "5xl" }}
        height={600}
        maxW="2000px"
        objectFit="cover"
        objectPosition="center"
        placeSelf="center"
        pointerEvents="none"
        position="absolute"
        src={locationBubbleImage}
        userSelect="none"
        w="100svw"
        width={400}
        z={-1}
      />
    </Container>
  )
}
