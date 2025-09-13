"use client"
import type { ImageProps } from "@repo/ui/components/Primitive"
import {
  Box,
  Center,
  LayoutGroup,
  Motion,
  useBreakpointValue,
  useDisclosure,
  useMotionValue,
  useReducedMotion,
  useTime,
  useTransform,
} from "@yamada-ui/react"
import dayjs from "dayjs"
import { useRef, useState } from "react"
import { LocationBubbleCircle } from "./LocationBubbleCircle"
import { LocationBubbleDesktopCard } from "./LocationBubbleDesktopCard"
import { LocationBubbleMobileCard } from "./LocationBubbleMobileCard"

/**
 * Props for the LocationBubble component.
 */
export interface LocationBubbleProps {
  locationImage: ImageProps
  locationTitle: string
  locationDetails?: string
  locationTimes?: Record<string, string[]>
  button?: {
    label?: string
    url?: string
  }
}

/**
 * Location Bubble component that displays a location with an floating bubble effect and provides more details on hover or click.
 *
 * @param locationImage The image source for the location, can be a URL or a static import.
 * @param locationTitle The title of the location.
 * @param locationDetails Optional details about the location, such as address or description.
 * @param locationTimes Optional object mapping days to the times for the location.
 * @param button Optional button configuration with label and URL properties. Defaults to `{ label: "Learn more", url: "#" }`.
 * @returns A `LocationBubble` component that displays a floating circular bubble, and expands to show more details on hover or click.
 */
export const LocationBubble = ({
  locationImage,
  locationTitle,
  locationDetails,
  locationTimes,
  button = { label: "Learn more", url: "#" },
}: LocationBubbleProps) => {
  const buttonData = {
    label: button?.label || "Learn more",
    url: button?.url || "#",
  }
  const locationTimeData = locationTimes
    ? Object.entries(locationTimes).reduce(
        (acc, [day, times]) => {
          acc[day] = times.map((time) => dayjs(new Date(time)).format("h:mmA"))
          return acc
        },
        {} as Record<string, string[]>,
      )
    : { [dayjs().format("dddd")]: [`${dayjs().format("h:mmA")}`] }

  // workaround until images uploads are properly configured
  locationImage = {
    ...locationImage,
    src: `${process.env.NEXT_PUBLIC_API_URL}${locationImage.src}`,
  }

  const [hovering, setHovering] = useState(false)
  const hoverDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { open, onOpen, onClose } = useDisclosure()

  const onHoverEnd = useBreakpointValue({
    base: () => {},
    md: () => {
      if (hoverDebounce.current) {
        clearTimeout(hoverDebounce.current)
        hoverDebounce.current = null
      }
      setHovering(false)
    },
  })

  const onHoverStart = useBreakpointValue({
    base: () => {},
    md: () => {
      hoverDebounce.current = setTimeout(() => {
        setHovering(true)
      }, 100)
    },
  })

  const shouldReduceMotion = useReducedMotion()
  const fallback = useMotionValue(0)
  const animatedTime = useTime()
  const time = shouldReduceMotion ? fallback : animatedTime
  const period = useMotionValue(
    1900 + (locationTitle.split("").reduce((acc, char) => acc + 31 * char.charCodeAt(0), 0) % 200),
  )
  const xRadius = useTransform(time, (t) => Math.cos(t / period.get() + period.get()) * 25)
  const yRadius = useTransform(time, (t) => Math.sin(t / period.get() + period.get()) * 25)
  const bubbleXValue = useTransform(time, (t) => Math.cos(t / 3500) * xRadius.get())
  const bubbleX = shouldReduceMotion ? fallback : bubbleXValue
  const bubbleYValue = useTransform(time, (t) => Math.sin(t / 3500) * yRadius.get())
  const bubbleY = shouldReduceMotion ? fallback : bubbleYValue

  return (
    <>
      <Box data-testid="location-bubble" pointerEvents="none" position="relative">
        <LayoutGroup id={locationTitle}>
          <Motion
            data-testid="location-bubble-hover-container"
            onHoverEnd={onHoverEnd}
            onHoverStart={onHoverStart}
            pointerEvents="all"
            width={hovering ? "332px" : "auto"}
          >
            {hovering ? (
              <LocationBubbleDesktopCard
                button={buttonData}
                locationDetails={locationDetails}
                locationImage={locationImage}
                locationTimes={locationTimeData}
                locationTitle={locationTitle}
              />
            ) : (
              <Center pointerEvents="none">
                <Motion
                  data-testid="location-bubble-circle-trigger"
                  height="fit-content"
                  onClick={onOpen}
                  pointerEvents="auto"
                  style={{
                    x: bubbleX,
                    y: bubbleY,
                  }}
                  whileTap={{
                    scale: 0.9,
                    rotateZ: 5,
                    transition: { type: "spring", stiffness: 300, damping: 15 },
                  }}
                  width="fit-content"
                >
                  <LocationBubbleCircle
                    locationImage={locationImage}
                    locationTitle={locationTitle}
                  />
                </Motion>
              </Center>
            )}
          </Motion>
        </LayoutGroup>
      </Box>
      <LocationBubbleMobileCard
        button={buttonData}
        locationDetails={locationDetails}
        locationImage={locationImage}
        locationTimes={locationTimeData}
        locationTitle={locationTitle}
        onClose={onClose}
        open={open}
      />
    </>
  )
}
