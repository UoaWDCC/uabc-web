import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Skeleton,
  Spacer,
  VStack,
} from '@yamada-ui/react'

export const SkeletonViewSessionCard = () => (
  <Card variant="outline" w="full" size="lg">
    <CardHeader>
      <Skeleton height="6" w="60%" />
      <Spacer />
      <Skeleton height="6" w="24px" />
    </CardHeader>
    <CardBody>
      <VStack mx="1" flex="1" justify="center" gap="sm">
        <HStack gap="sm" alignItems="center" w="full">
          <Skeleton height="6" w="24px" />
          <Skeleton height="4" flex="1" />
        </HStack>
        <HStack gap="sm" alignItems="center" w="full">
          <Skeleton height="6" w="24px" />
          <Skeleton height="8" flex="1" />
        </HStack>
        <HStack gap="sm" alignItems="center" w="full">
          <Skeleton height="6" w="24px" />
          <Skeleton height="4" flex="1" />
        </HStack>
      </VStack>
    </CardBody>
    <CardFooter>
      <Skeleton height="10" w="full" />
    </CardFooter>
  </Card>
)
