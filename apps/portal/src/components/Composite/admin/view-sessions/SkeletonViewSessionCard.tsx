import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Skeleton,
  Spacer,
  VStack,
} from "@yamada-ui/react"

export const SkeletonViewSessionCard = () => (
  <Card size="lg" variant="outline" w="full">
    <CardHeader>
      <Skeleton height="6" w="60%" />
      <Spacer />
      <Skeleton height="6" w="24px" />
    </CardHeader>
    <CardBody>
      <VStack flex="1" gap="sm" justify="center" mx="1">
        <HStack alignItems="center" gap="sm" w="full">
          <Skeleton height="6" w="24px" />
          <Skeleton flex="1" height="4" />
        </HStack>
        <HStack alignItems="center" gap="sm" w="full">
          <Skeleton height="6" w="24px" />
          <Skeleton flex="1" height="8" />
        </HStack>
        <HStack alignItems="center" gap="sm" w="full">
          <Skeleton height="6" w="24px" />
          <Skeleton flex="1" height="4" />
        </HStack>
      </VStack>
    </CardBody>
    <CardFooter>
      <Skeleton height="10" w="full" />
    </CardFooter>
  </Card>
)
