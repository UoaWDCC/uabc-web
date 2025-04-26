import { Card, CardBody, CardHeader, HStack, Skeleton, Spacer } from "@yamada-ui/react"
import { memo } from "react"

const UnmemoizedSkeletonSemesterCard = () => {
  return (
    <Card color="tertiary" fontSize="sm" variant="subtle">
      <CardHeader>
        <HStack w="full">
          <Skeleton h="6" w="40" />
          <Spacer />
          <Skeleton h="8" rounded="md" w="8" />
        </HStack>
      </CardHeader>
      <CardBody gap="sm" pt="sm">
        <Skeleton h="4" w="64" />
        <Skeleton h="4" w="48" />
        <Skeleton h="4" w="44" />
        <Skeleton h="4" w="56" />
      </CardBody>
    </Card>
  )
}

export const SkeletonSemesterCard = memo(UnmemoizedSkeletonSemesterCard)
