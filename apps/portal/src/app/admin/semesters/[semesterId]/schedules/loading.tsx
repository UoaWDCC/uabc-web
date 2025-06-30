import { Container, IconButton, Skeleton, Spacer, VStack } from "@yamada-ui/react"
import { SkeletonScheduleCard } from "@/components/Composite/admin/schedules/SkeletonScheduleCard"
import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"

export default function Loading() {
  return (
    <Container minH="100dvh">
      <BackNavigationBar pathName="/admin/semesters" title="Schedules">
        <Spacer />
        <Skeleton>
          <IconButton />
        </Skeleton>
      </BackNavigationBar>
      <VStack>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonScheduleCard key={`skeleton-${index + 1}`} />
        ))}
      </VStack>
    </Container>
  )
}
