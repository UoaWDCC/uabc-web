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
 * Location Bubble Circle component that displays the circular bubble with an image and a maximize icon.
 *
 * @param locationImage The image source for the location, can be a URL or a static import.
 * @param locationTitle The title of the location.
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
        borderColor="transparent"
        borderWidth={{ base: "3.25px", md: "5px" }}
        height={{ base: "96px", md: "148px" }}
        initial={{ scale: 1.25 }}
        layoutId="location-bubble-border"
        mask="conic-gradient(white 0 0) padding-box exclude, conic-gradient(white 0 0)"
        position="absolute"
        style={{ borderRadius: "74px" }}
        transition={{ type: "spring", bounce: 0.35, visualDuration: 0.5 }}
        width={{ base: "96px", md: "148px" }}
      />
      <Motion
        height={{ base: "96px", md: "148px" }}
        layoutId="location-bubble-background"
        position="absolute"
        transition={{ type: "spring", bounce: 0.35, visualDuration: 0.6 }}
        width={{ base: "96px", md: "148px" }}
      >
        <Motion height="full" layoutId="location-bubble-title" width="full" />
      </Motion>
      <Box
        data-testid="location-bubble-circle"
        position="relative"
        width={{ base: "96px", md: "148px" }}
      >
        <Motion
          animate={{ scale: 1 }}
          borderColor="transparent"
          borderWidth={{ base: "6.5px", md: "10px" }}
          height={{ base: "96px", md: "148px" }}
          initial={{ scale: 1.25 }}
          inset={{ base: "-3.25px", md: "-5px" }}
          layoutId="location-bubble-image"
          margin={{ base: "3.25px", md: "5px" }}
          overflow="hidden"
          position="relative"
          style={{ borderRadius: "74px" }}
          transition={{ type: "spring", bounce: 0.3, visualDuration: 0.4 }}
          width={{ base: "96px", md: "148px" }}
        >
          <Center height="100%" overflow="hidden" width="100%">
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
          </Center>
        </Motion>
        <Motion
          animate={{ opacity: 1, scale: 1 }}
          bottom={0}
          initial={{ opacity: 0, scale: 0.5 }}
          position="absolute"
          right={0}
          transition={{ type: "spring", bounce: 0.5, visualDuration: 0.5 }}
        >
          <Center bgColor="black" borderRadius="50%" padding={{ base: "7.2px", md: "12px" }}>
            <Maximize2Icon boxSize={{ base: 3, md: 5 }} color="white" />
          </Center>
        </Motion>
      </Box>
    </>
  )
}
