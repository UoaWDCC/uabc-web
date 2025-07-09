import { Heading } from "@repo/ui/components/Primitive"
import { Container, Skeleton, Text } from "@yamada-ui/react"

export default function SemesterLoading() {
  return (
    <Container>
      <Heading.h1>Semester (Dynamic Example)</Heading.h1>
      <Skeleton>
        <Heading.h2>Loading...</Heading.h2>
      </Skeleton>
      <Skeleton>
        <Text>Loading...</Text>
      </Skeleton>
      <Skeleton>
        <Text>Loading...</Text>
      </Skeleton>
      <Skeleton>
        <Text>Loading...</Text>
      </Skeleton>
      <Skeleton>
        <Text>Loading...</Text>
      </Skeleton>
      <Skeleton>
        <Text>Loading...</Text>
      </Skeleton>
    </Container>
  )
}
