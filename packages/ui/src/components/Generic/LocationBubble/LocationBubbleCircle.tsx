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
        animate={{ scale: 1 }}
        background="linear-gradient(135deg, #5407FF 8%, #89A5DA 100%) border-box"
        border="5px solid transparent"
        height={148}
        initial={{ scale: 1.5 }}
        layoutId="bubble-border"
        mask="conic-gradient(white 0 0) padding-box exclude, conic-gradient(white 0 0)"
        position="absolute"
        style={{ borderRadius: "74px" }}
        transition={{ type: "spring", bounce: 0.35, visualDuration: 0.5 }}
        width={148}
      />
      <Motion
        height={148}
        layoutId="bubble-background"
        position="absolute"
        transition={{ type: "spring", bounce: 0.35, visualDuration: 0.6 }}
        width={148}
      >
        <Motion height="full" layoutId="location-title" style={{ opacity: 0 }} width="full" />
      </Motion>
      <Box data-testid="location-bubble-circle" position="relative" width={148}>
        <Motion
          border="10px solid transparent"
          borderRadius="50%"
          height={148}
          inset="-5px"
          layoutId="location-image"
          margin="5px"
          overflow="hidden"
          position="relative"
          transition={{ type: "spring", bounce: 0.3, visualDuration: 0.5 }}
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
          // transition={{ type: "spring", stiffness: 300, damping: 15 }}
          transition={{ type: "spring", bounce: 0.5, visualDuration: 0.5 }}
        >
          <Center bgColor="black" borderRadius="50%" padding="12px">
            <Maximize2Icon boxSize={5} color="white" />
          </Center>
        </Motion>
      </Box>
    </>
  )
}
