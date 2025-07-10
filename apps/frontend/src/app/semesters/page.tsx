import { Heading } from "@repo/ui/components/Primitive"
import { Container, VStack } from "@yamada-ui/react"
import SemesterContent from "./semester-content"

export default function SemesterPage() {
  return (
    <Container>
      <VStack>
        <Heading.h2>Semester Detail</Heading.h2>
        <SemesterContent />
      </VStack>
    </Container>
  )
}
