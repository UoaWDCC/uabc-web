import { Maximize2Icon } from "@yamada-ui/lucide"
import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  Motion,
  Spacer,
  Text,
  useDisclosure,
  useMotionValue,
  useReducedMotion,
  useTime,
  useTransform,
  VStack,
} from "@yamada-ui/react"
import type { StaticImport } from "next/dist/shared/lib/get-img-props"
// import next link
import Link from "next/link"
import { useRef, useState } from "react"
import { Button, Heading, Image } from "../../Primitive"

/**
 * Props for the LocationBubble component.
 */
interface LocationBubbleProps {
  locationImage: string | StaticImport
  locationTitle: string
  locationDetails?: string
  locationTimes?: Record<string, string>
  buttonLink?: string
}

/**
 *
 * Location Bubble component that displays a location with an floating bubble effect and provides more details on hover or click.
 *
 * @param locationImage - The image source for the location, can be a URL or a static import.
 * @param locationTitle - The title of the location.
 * @param locationDetails - Optional details about the location, such as address or description.
 * @param locationTimes - Optional object containing days and times for the location, e.g.,
 * `{ Tuesday: "7:30pm - 10pm", Friday: "7:30pm - 10pm" }`.
 * @param buttonLink - Optional link for a button to learn more about the location, defaults to `"#"`.
 * @returns A `LocationBubble` component that displays a floating circular bubble, and expands to show more details on hover or click.
 */
export const LocationBubble = ({
  locationImage,
  locationTitle,
  locationDetails,
  locationTimes,
  buttonLink = "#",
}: LocationBubbleProps) => {
  const [hovering, setHovering] = useState(false)
  const hoverDebounce = useRef<NodeJS.Timeout | null>(null)

  const { open, onOpen, onClose } = useDisclosure()

  const shouldReduceMotion = useReducedMotion()
  const fallback = useMotionValue(0)
  const animatedTime = useTime()
  const time = shouldReduceMotion ? fallback : animatedTime
  const direction = Math.random() > 0.5 ? 1 : -1
  const xRadius = useTransform(time, (t) => Math.cos(t / 2000) * 25)
  const yRadius = useTransform(time, (t) => Math.sin(t / 2000) * 25)
  const bubbleXValue = useTransform(time, (t) => Math.cos(t / 3500) * xRadius.get() * direction)
  const bubbleX = shouldReduceMotion ? fallback : bubbleXValue
  const bubbleYValue = useTransform(time, (t) => Math.sin(t / 3500) * yRadius.get() * direction)
  const bubbleY = shouldReduceMotion ? fallback : bubbleYValue

  return (
    <>
      <Box data-testid="location-bubble" height={468} position="relative" width={348}>
        {hovering ? (
          <Motion
            data-testid="location-bubble-desktop-card-wrapper"
            onHoverEnd={() => {
              if (hoverDebounce.current) {
                clearTimeout(hoverDebounce.current)
                hoverDebounce.current = null
              }
              setHovering(false)
            }}
          >
            <LocationBubbleDesktopCard
              buttonLink={buttonLink}
              locationDetails={locationDetails}
              locationImage={locationImage}
              locationTimes={locationTimes}
              locationTitle={locationTitle}
            />
          </Motion>
        ) : (
          <Center height="100%" width="100%">
            <Motion
              data-testid="location-bubble-circle-trigger"
              onClick={onOpen}
              onHoverEnd={() => {
                if (hoverDebounce.current) {
                  clearTimeout(hoverDebounce.current)
                  hoverDebounce.current = null
                }
                setHovering(false)
              }}
              onHoverStart={() => {
                hoverDebounce.current = setTimeout(() => {
                  setHovering(true)
                }, 100)
              }}
              style={{
                x: bubbleX,
                y: bubbleY,
              }}
            >
              <LocationBubbleCircle locationImage={locationImage} locationTitle={locationTitle} />
            </Motion>
          </Center>
        )}
      </Box>
      {open && (
        <Drawer
          borderTopRadius="26px"
          closeOnDrag
          onClose={onClose}
          open={open}
          placement="bottom"
          size="xl"
        >
          <DrawerHeader />
          <DrawerCloseButton />
          <DrawerBody height="100%" padding={0}>
            <LocationBubbleMobileCard
              buttonLink={buttonLink}
              locationDetails={locationDetails}
              locationImage={locationImage}
              locationTimes={locationTimes}
              locationTitle={locationTitle}
            />
          </DrawerBody>
        </Drawer>
      )}
    </>
  )
}

/**
 *
 * Location Bubble Circle component that displays the circular bubble with an image and a maximize icon.
 *
 * @param locationImage - The image source for the location, can be a URL or a static import.
 * @param locationTitle - The title of the location.
 * @returns A `LocationBubbleCircle` component that displays a circular bubble with an image and a maximize icon.
 */
export const LocationBubbleCircle = ({
  locationImage,
  locationTitle,
}: {
  locationImage: string | StaticImport
  locationTitle: string
}) => {
  return (
    <>
      <Motion
        animate={{ opacity: 1, scale: 1, y: 0 }}
        background="linear-gradient(135deg, #5407FF 8%, #89A5DA 100%) border-box"
        border="5px solid transparent"
        borderRadius="50%"
        height={148}
        initial={{ opacity: 0, scale: 1.5, y: -20 }}
        mask="conic-gradient(white 0 0) padding-box exclude, conic-gradient(white 0 0)"
        position="absolute"
        transition={{
          default: { type: "spring", stiffness: 300, damping: 22.5, delay: 0.1 },
        }}
        width={148}
      />
      <Motion
        height={148}
        layoutId="bubble-background"
        position="absolute"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        width={148}
      />
      <Box data-testid="location-bubble-circle" position="relative" width={148}>
        <Motion
          animate={{ opacity: 1 }}
          border="10px solid transparent"
          borderRadius="50%"
          height={148}
          initial={{ opacity: 0 }}
          inset="-5px"
          layoutId="location-image"
          margin="5px"
          overflow="hidden"
          position="relative"
          transition={{ duration: 0.25 }}
          width={148}
        >
          <Image
            alt={locationTitle}
            height={148}
            objectFit="cover"
            objectPosition="center"
            src={locationImage}
            width={148}
          />
        </Motion>
        <Motion
          animate={{ opacity: 1, scale: 1 }}
          bottom={0}
          initial={{ opacity: 0, scale: 0.5 }}
          position="absolute"
          right={0}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Center bgColor="black" borderRadius="50%" padding="12px">
            <Maximize2Icon boxSize={5} color="white" />
          </Center>
        </Motion>
      </Box>
    </>
  )
}

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
          <VStack gap="18px">
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
}: LocationBubbleProps) => {
  return (
    <VStack
      align="center"
      data-testid="location-bubble-mobile-card"
      gap="18px"
      height="100%"
      paddingX="lg"
      width="100%"
    >
      <VStack align="center" gap={6} textAlign="center">
        <Heading.h1 bgClip="text" bgGradient="primaryGradient">
          {locationTitle}
        </Heading.h1>
        {locationDetails && (
          <Text bgClip="text" bgGradient="textGradient">
            {locationDetails}
          </Text>
        )}
      </VStack>
      <Center paddingX="lg" width="100%">
        <Image
          alt={locationTitle}
          borderRadius="lg"
          h="100%"
          height={150}
          maxW={360}
          src={locationImage}
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
      <Spacer />
      <Button as={Link} colorScheme="primary" href={buttonLink} size="md" width="fit-content">
        Learn More
      </Button>
    </VStack>
  )
}
