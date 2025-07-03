import { Box, Button, Motion, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"
import { Heading, Image } from "../../Primitive"
import type { LocationBubbleProps } from "."

/**
 *
 * Card containing details about a location, displayed for a desktop view.
 *
 * @param locationImage - The image source for the location, can be a URL or a static import.
 * @param locationTitle - The title of the location.
 * @param locationDetails - Optional details about the location, such as address or description.
 * @param locationTimes - Optional object containing days and times for the location, e.g.,
 * `{ Tuesday: "7:30pm - 10pm", Friday: "7:30pm - 10pm" }`.
 * @param buttonLink - Optional link for a button to learn more about the location, defaults to `"#"`.
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
        animate={{ opacity: 1, scale: 1 }}
        background="linear-gradient(135deg, #5407FF 8%, #89A5DA 100%) border-box"
        border="6px solid transparent"
        borderRadius="26px"
        height="100%"
        initial={{ opacity: 0, scale: 0.5 }}
        mask="conic-gradient(white 0 0) padding-box exclude, conic-gradient(white 0 0)"
        padding="6px"
        position="absolute"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        width="100%"
      />
      <Motion
        layoutId="bubble-background"
        padding="12px"
        transition={{ type: "spring", stiffness: 300, damping: 20, staggerChildren: 0.1 }}
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
            layoutId="location-image"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              alt={locationTitle}
              borderRadius="14px"
              h="100%"
              height={150}
              src={locationImage}
              w="100%"
              width={270}
            />
          </Motion>
          <VStack gap="md">
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
          <Button as={Link} colorScheme="primary" href={buttonLink} size="lg">
            Learn More
          </Button>
        </VStack>
      </Motion>
    </Box>
  )
}
