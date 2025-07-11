import { Heading, Image } from "@repo/ui/components/Primitive"
import { Box, Button, Motion, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"
import type { LocationBubbleProps } from "."

/**
 * Card containing details about a location, displayed for a desktop view.
 *
 * @param locationImage The image source for the location, can be a URL or a static import.
 * @param locationTitle The title of the location.
 * @param locationDetails Optional details about the location, such as address or description.
 * @param locationTimes Optional object containing days and times for the location, e.g.,
 * `{ Tuesday: "7:30pm - 10pm", Friday: "7:30pm - 10pm" }`.
 * @param buttonLink Optional link for a button to learn more about the location, defaults to `"#"`.
 * @returns A `LocationBubbleDesktopCard` component that displays a card with an image, title, details, times, and a button.
 */
export const LocationBubbleDesktopCard = ({
  locationImage,
  locationTitle,
  locationDetails,
  locationTimes,
  buttonLink = "#",
}: LocationBubbleProps) => {
  return (
    <Box data-testid="location-bubble-desktop-card" h="100%" position="relative" width="100%">
      <Motion
        animate={{ scale: 1 }}
        background="linear-gradient(135deg, #5407FF 8%, #89A5DA 100%) border-box"
        border="6px solid transparent"
        height="100%"
        initial={{ scale: 0.5 }}
        layoutId="location-bubble-border"
        mask="conic-gradient(white 0 0) padding-box exclude, conic-gradient(white 0 0)"
        padding="6px"
        position="absolute"
        style={{ borderRadius: "26px" }}
        transition={{ type: "spring", bounce: 0.3, visualDuration: 0.4 }}
        width="100%"
      />
      <Motion
        layoutId="location-bubble-background"
        padding="12px"
        transition={{ type: "spring", bounce: 0.25, visualDuration: 0.4 }}
      >
        <VStack
          bgColor="black"
          border="12px solid transparent"
          borderRadius="18px"
          gap="lg"
          padding="12px"
          textAlign="center"
        >
          <Motion
            layoutId="location-bubble-image"
            overflow="hidden"
            style={{ borderRadius: "14px", height: "100%", width: "100%" }}
            transition={{ type: "spring", bounce: 0.25, visualDuration: 0.4 }}
          >
            <Image
              alt={locationTitle}
              h="100%"
              height={150}
              objectFit="cover"
              objectPosition="center"
              {...locationImage}
              w="100%"
              width={270}
            />
          </Motion>
          <Motion
            animate={{ scale: 1 }}
            initial={{ scale: 0 }}
            layout="position"
            layoutId="location-bubble-title"
            transition={{
              default: { type: "spring", bounce: 0.25, visualDuration: 0.4 },
              opacity: { type: "spring", bounce: 0.25, visualDuration: 0.4, delay: 0.1 },
            }}
          >
            <VStack as={Motion} gap="md">
              <VStack fontSize="xl" fontWeight="semibold" gap={0} textAlign="center">
                <Heading.h2 bgClip="text" bgGradient="primaryGradient">
                  {locationTitle}
                </Heading.h2>
                {locationTimes &&
                  Object.entries(locationTimes).map(([day, time]) => (
                    <Text bgClip="text" bgGradient="textGradient" key={day}>
                      {day}: {time}
                    </Text>
                  ))}
              </VStack>
              {locationDetails && (
                <Text bgClip="text" bgGradient="textGradient" fontWeight="normal">
                  {locationDetails}
                </Text>
              )}
            </VStack>
          </Motion>
          <Button as={Link} colorScheme="primary" href={buttonLink} size="lg">
            Learn More
          </Button>
        </VStack>
      </Motion>
    </Box>
  )
}
