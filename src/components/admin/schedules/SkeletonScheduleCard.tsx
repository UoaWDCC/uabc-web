import { Card, CardBody, CardHeader, HStack, Skeleton, Spacer } from '@yamada-ui/react'
import { memo } from 'react'

const UnmemoizedSkeletonScheduleCard = () => {
  return (
    <Card fontSize="sm" color="tertiary" variant="subtle">
      <CardHeader>
        <HStack w="full">
          <Skeleton h="6" w="40" />
          <Spacer />
          <Skeleton h="8" w="8" rounded="md" />
        </HStack>
      </CardHeader>
      <CardBody gap="sm" pt="sm">
        <Skeleton h="4" w="60" />
        <Skeleton h="4" w="48" />
        <Skeleton h="4" w="56" />
        <Skeleton h="4" w="40" />
        <Skeleton h="4" w="40" />
      </CardBody>
    </Card>
  )
}

export const SkeletonScheduleCard = memo(UnmemoizedSkeletonScheduleCard)
