"use client"

import { GetSemesterResponseSchema } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import { DataList, EmptyState, VStack } from "@yamada-ui/react"
import { useQueryState } from "nuqs"
import { apiClient } from "@/lib/api/client"
import { SemesterLoadingSkeleton } from "./page"
import { parsers } from "./search"

type Semester = NonNullable<NonNullable<ReturnType<typeof GetSemesterResponseSchema.parse>>["data"]>

const createSemesterItems = (semester: Semester) => [
  {
    term: "Name",
    description: semester.name,
  },
  {
    term: "Start Date",
    description: semester.startDate,
  },
  {
    term: "End Date",
    description: semester.endDate,
  },
  {
    term: "Break Start",
    description: semester.breakStart,
  },
  {
    term: "Break End",
    description: semester.breakEnd,
  },
  {
    term: "Booking Open Day",
    description: semester.bookingOpenDay,
  },
  {
    term: "Booking Open Time",
    description: semester.bookingOpenTime,
  },
]

export default function SemesterContent() {
  const [id] = useQueryState("id", parsers.id)

  const {
    data: semester,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["semester", id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await apiClient.get(`/api/semesters/${id}`, GetSemesterResponseSchema, [
        "semester",
        id,
      ])
      return data?.data ?? null
    },
    enabled: !!id,
  })

  if (!id) {
    return <EmptyState title="Please select a semester to see details" />
  }

  if (isLoading) {
    return <SemesterLoadingSkeleton />
  }

  if (isError) {
    return <EmptyState title="Error loading semester" />
  }

  if (!semester) {
    return <EmptyState title="Semester not found" />
  }

  const items = createSemesterItems(semester)

  return (
    <VStack>
      <DataList items={items} />
    </VStack>
  )
}
