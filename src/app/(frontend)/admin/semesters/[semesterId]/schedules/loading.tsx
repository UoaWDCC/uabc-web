import { Container, IconButton, Skeleton, Spacer, VStack } from '@yamada-ui/react'

import { BackNavigationBar } from '@/components/Composite/BackNavigationBar'
import { SkeletonScheduleCard } from '@/components/Composite/admin/schedules/SkeletonScheduleCard'

export default function Loading() {
  return (
    <Container minH="100dvh">
      <BackNavigationBar title="Schedules" pathName="/admin/semesters">
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
