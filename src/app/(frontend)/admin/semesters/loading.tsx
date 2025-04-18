import { Container, IconButton, Skeleton, Spacer, VStack } from '@yamada-ui/react'

import { BackNavigationBar } from '@/components/BackNavigationBar'
import { SkeletonScheduleCard } from '@/components/admin/schedules/SkeletonScheduleCard'

export default function Loading() {
  return (
    <Container minH="100dvh">
      <BackNavigationBar title="Semesters" pathName="/admin">
        <Spacer />
        <Skeleton>
          <IconButton />
        </Skeleton>
      </BackNavigationBar>
      <VStack>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonScheduleCard key={index} />
        ))}
      </VStack>
    </Container>
  )
}
