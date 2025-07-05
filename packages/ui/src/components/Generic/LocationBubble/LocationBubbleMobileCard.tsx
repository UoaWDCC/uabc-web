import { Heading, Image } from "@repo/ui/components/Primitive"
import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerHeader,
  type DrawerProps,
  Text,
  VStack,
} from "@yamada-ui/react"
import Link from "next/link"
import type { LocationBubbleProps } from "."

/**
 * Props for the `LocationBubbleMobileCard` component.
 */
export interface LocationBubbleMobileCardProps extends LocationBubbleProps, DrawerProps {}

/**
 *
 * Card containing details about a location, displayed for a mobile view.
 *
 * @param locationImage - The image source for the location, can be a URL or a static import.
 * @param locationTitle - The title of the location.
 * @param locationDetails - Optional details about the location, such as address or description.
 * @param locationTimes - Optional object containing days and times for the location, e.g.,
 * `{ Tuesday: "7:30pm - 10pm", Friday: "7:30pm - 10pm" }`.
 * @param buttonLink - Optional link for a button to learn more about the location, defaults to `"#"`.
 * @returns A `LocationBubbleMobileCard` component that displays a card with an image, title, details, times, and a button.
 */
export const LocationBubbleMobileCard = ({
  locationImage,
  locationTitle,
  locationDetails,
  locationTimes,
  buttonLink = "#",
  open,
  onClose,
}: LocationBubbleMobileCardProps) => {
  return (
    <Drawer
      borderTopRadius="26px"
      closeOnDrag
      data-testid="location-bubble-mobile-card"
      onClose={onClose}
      open={open}
      placement="bottom"
      size="xl"
    >
      <DrawerHeader>
        <Center width="100%">
          <Heading.h1 bgClip="text" bgGradient="primaryGradient" textAlign="center">
            {locationTitle}
          </Heading.h1>
        </Center>
      </DrawerHeader>
      <DrawerBody height="100%" paddingBottom="md">
        <VStack
          align="center"
          data-testid="location-bubble-mobile-card-wrapper"
          gap="lg"
          height="100%"
          paddingX="lg"
          width="100%"
        >
          {locationDetails && (
            <Text bgClip="text" bgGradient="textGradient">
              {locationDetails}
            </Text>
          )}
          <Center paddingX="lg" width="100%">
            <Image
              alt={locationTitle}
              borderRadius="lg"
              h="100%"
              height={150}
              maxW={360}
              {...locationImage}
              w="100%"
              width={270}
            />
          </Center>
          <VStack fontSize="xl" fontWeight="semibold" gap={0} textAlign="center">
            {locationTimes &&
              Object.entries(locationTimes).map(([day, time]) => (
                <Text bgClip="text" bgGradient="textGradient" key={day}>
                  {day}: {time}
                </Text>
              ))}
          </VStack>
          <Button as={Link} colorScheme="primary" href={buttonLink} size="lg">
            Learn More
          </Button>
        </VStack>
      </DrawerBody>
    </Drawer>
  )
}
