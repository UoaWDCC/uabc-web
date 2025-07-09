import { Heading } from "@repo/ui/components/Primitive"
import {
  Container,
  DataList,
  DataListDescription,
  DataListItem,
  DataListTerm,
  Skeleton,
  Text,
  VStack,
} from "@yamada-ui/react"
import { Suspense } from "react"
import SemesterContent from "./semester-content"

const terms = [
  "Name",
  "Start Date",
  "End Date",
  "Break Start",
  "Break End",
  "Booking Open Day",
  "Booking Open Time",
]

export default function SemesterPage() {
  return (
    <Container>
      <VStack>
        <Heading.h2>Semester Detail</Heading.h2>
        <Suspense
          fallback={
            <DataList col={2}>
              {terms.map((term) => (
                <DataListItem key={term}>
                  <DataListTerm>{term}</DataListTerm>
                  <DataListDescription>
                    <Skeleton>
                      <Text>Description</Text>
                    </Skeleton>
                  </DataListDescription>
                </DataListItem>
              ))}
            </DataList>
          }
        >
          <SemesterContent />
        </Suspense>
      </VStack>
    </Container>
  )
}
