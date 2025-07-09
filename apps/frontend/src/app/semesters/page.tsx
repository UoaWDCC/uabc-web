import { Heading } from "@repo/ui/components/Primitive"
import { Container, DataList, EmptyState, VStack } from "@yamada-ui/react"
import type { SearchParams } from "nuqs/server"
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"
import { getSemester } from "@/lib/api/endpoints"

export const parsers = {
  id: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
}
export const searchParamsCache = createSearchParamsCache(parsers)

async function SemesterDetail() {
  const { id } = searchParamsCache.all()
  const { data } = await getSemester(id)

  if (!data || !data.data) {
    return <EmptyState title="Semester not found" />
  }

  const semester = data.data

  const items = [
    {
      term: "Name",
      description: semester?.name,
    },
    {
      term: "Start Date",
      description: semester?.startDate,
    },
    {
      term: "End Date",
      description: semester?.endDate,
    },
    {
      term: "Break Start",
      description: semester?.breakStart,
    },
    {
      term: "Break End",
      description: semester?.breakEnd,
    },
    {
      term: "Booking Open Day",
      description: semester?.bookingOpenDay,
    },
    {
      term: "Booking Open Time",
      description: semester?.bookingOpenTime,
    },
  ]

  return (
    <VStack>
      <Heading.h2>Semester Detail</Heading.h2>
      <DataList items={items} />
    </VStack>
  )
}

export default async function SemesterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await searchParamsCache.parse(searchParams)
  return (
    <Container>
      <Heading.h1>Semester</Heading.h1>
      <SemesterDetail />
    </Container>
  )
}
