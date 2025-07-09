"use client"

import { GetSemesterResponseSchema } from "@repo/shared/schemas"
import { useSuspenseQuery } from "@tanstack/react-query"
import { DataList, EmptyState, VStack } from "@yamada-ui/react"
import { useQueryState } from "nuqs"
import { apiClient } from "@/lib/api/client"
import { parsers } from "./search"

export default function SemesterContent() {
  const [id] = useQueryState("id", parsers.id)

  const { data: semester, isError } = useSuspenseQuery({
    queryKey: ["semester", id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await apiClient.get(`/api/semesters/${id}`, GetSemesterResponseSchema, [
        "semester",
        id,
      ])
      return data?.data
    },
  })

  return (
    <>
      {!id ? (
        <EmptyState title="Please select a semester to see details" />
      ) : isError || !semester ? (
        <EmptyState title="Semester not found" />
      ) : (
        (() => {
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
              <DataList items={items} />
            </VStack>
          )
        })()
      )}
    </>
  )
}
