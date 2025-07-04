import { Image, type ImageProps } from "@repo/ui/components/Primitive"
import { Maximize2Icon } from "@yamada-ui/lucide"
import { Box, Center, Motion } from "@yamada-ui/react"

/**
 * Props for the `LocationBubbleCircle` component.
 */
interface LocationBubbleCircleProps {
  locationImage: ImageProps
  locationTitle: string
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
}: LocationBubbleCircleProps) => {
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
            {...locationImage}
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
