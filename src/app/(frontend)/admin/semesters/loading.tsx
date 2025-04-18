import { Container, IconButton, Spacer, VStack, Skeleton } from '@yamada-ui/react'

import { BackNavigationBar } from '@/components/Composite/BackNavigationBar'
import { SkeletonScheduleCard } from '@/components/Composite/admin/schedules/SkeletonScheduleCard'

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
