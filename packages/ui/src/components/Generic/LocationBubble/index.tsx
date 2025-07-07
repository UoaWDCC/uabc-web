"use client"
import type { ImageProps } from "@repo/ui/components/Primitive"
import {
  Box,
  Center,
  LayoutGroup,
  Motion,
  useDisclosure,
  useMotionValue,
  useReducedMotion,
  useTime,
  useTransform,
} from "@yamada-ui/react"
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
  locationTimes?: Record<string, string>
  buttonLink?: string
}

/**
 * Location Bubble component that displays a location with an floating bubble effect and provides more details on hover or click.
 *
 * @param locationImage The image source for the location, can be a URL or a static import.
 * @param locationTitle The title of the location.
 * @param locationDetails Optional details about the location, such as address or description.
 * @param locationTimes Optional object containing days and times for the location, e.g.,
 * `{ Tuesday: "7:30pm - 10pm", Friday: "7:30pm - 10pm" }`.
 * @param buttonLink Optional link for a button to learn more about the location, defaults to `"#"`.
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
  const direction = useMotionValue(Math.random() > 0.5 ? 1 : -1)
  const xRadius = useTransform(time, (t) => Math.cos(t / 2000) * 25)
  const yRadius = useTransform(time, (t) => Math.sin(t / 2000) * 25)
  const bubbleXValue = useTransform(
    time,
    (t) => Math.cos(t / 3500) * xRadius.get() * direction.get(),
  )
  const bubbleX = shouldReduceMotion ? fallback : bubbleXValue
  const bubbleYValue = useTransform(
    time,
    (t) => Math.sin(t / 3500) * yRadius.get() * direction.get(),
  )
  const bubbleY = shouldReduceMotion ? fallback : bubbleYValue

  return (
    <>
      <Box data-testid="location-bubble" height={468} position="relative" width={348}>
        <LayoutGroup id={locationTitle}>
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
                onTap={onOpen}
                style={{
                  x: bubbleX,
                  y: bubbleY,
                }}
                whileTap={{
                  scale: 0.9,
                  rotateZ: 5,
                  transition: { type: "spring", stiffness: 300, damping: 15 },
                }}
              >
                <LocationBubbleCircle locationImage={locationImage} locationTitle={locationTitle} />
              </Motion>
            </Center>
          )}
        </LayoutGroup>
      </Box>
      <LocationBubbleMobileCard
        buttonLink={buttonLink}
        locationDetails={locationDetails}
        locationImage={locationImage}
        locationTimes={locationTimes}
        locationTitle={locationTitle}
        onClose={onClose}
        open={open}
      />
    </>
  )
}
