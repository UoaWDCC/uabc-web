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

const terms = [
  "Name",
  "Start Date",
  "End Date",
  "Break Start",
  "Break End",
  "Booking Open Day",
  "Booking Open Time",
]

export default function SemesterLoading() {
  return (
    <Container>
      <Heading.h1>Semester</Heading.h1>
      <VStack>
        <Heading.h2>Semester Detail</Heading.h2>
        <DataList col={2}>
          {Array.from({ length: 7 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: for skeleton
            <DataListItem key={index}>
              <DataListTerm>
                <Text>{terms[index]}</Text>
              </DataListTerm>
              <DataListDescription>
                <Skeleton>
                  <Text>Description</Text>
                </Skeleton>
              </DataListDescription>
            </DataListItem>
          ))}
        </DataList>
      </VStack>
    </Container>
  )
}
