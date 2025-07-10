"use client"

import { GetSemesterResponseSchema } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import {
  DataList,
  DataListDescription,
  DataListItem,
  DataListTerm,
  EmptyState,
  Skeleton,
  Text,
  VStack,
} from "@yamada-ui/react"
import { useQueryState } from "nuqs"
import { apiClient } from "@/lib/api/client"
import { parsers } from "./search"

const terms = [
  "Name",
  "Start Date",
  "End Date",
  "Break Start",
  "Break End",
  "Booking Open Day",
  "Booking Open Time",
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
  })

  return (
    <>
      {!id ? (
        <EmptyState title="Please select a semester to see details" />
      ) : isLoading ? (
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
      ) : isError ? (
        <EmptyState title="Error loading semester" />
      ) : !semester ? (
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
