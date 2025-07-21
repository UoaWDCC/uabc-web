import { Heading } from "@repo/ui/components/Primitive"
import { Skeleton, VStack } from "@yamada-ui/react"
import { type FC, memo } from "react"

export const ProfileBookingPanelSkeleton: FC = memo(() => {
  return (
    <VStack
      bg={["secondary.50", "secondary.900"]}
      gap="lg"
      layerStyle="gradientBorder"
      p="xl"
      rounded="2xl"
      w="full"
    >
      <Skeleton borderRadius="md" height="32px" mb="md" width="180px">
        <Heading.h3>Your Bookings</Heading.h3>
      </Skeleton>
      <VStack gap="md" w="full">
        {[1, 2, 3].map((i) => (
          <Skeleton borderRadius="md" height="120px" key={i} w="full" />
        ))}
      </VStack>
    </VStack>
  )
})
