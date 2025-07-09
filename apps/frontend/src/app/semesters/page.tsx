"use client"

import { GetSemesterResponseSchema } from "@repo/shared/schemas"
import { Heading } from "@repo/ui/components/Primitive"
import { useQuery } from "@tanstack/react-query"
import {
  Container,
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

export default function SemesterPage() {
  const [id] = useQueryState("id", parsers.id)

  const {
    data: semester,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["semester", id],
    queryFn: async () => {
      if (!id) return null
      const { data } = await apiClient.get(`/api/semesters/${id}`, GetSemesterResponseSchema, [
        "semester",
        id,
      ])
      return data?.data
    },
    enabled: !!id,
  })

  return (
    <Container>
      <Heading.h1>Semester</Heading.h1>
      {!id ? (
        <EmptyState title="Please select a semester to see details" />
      ) : isLoading ? (
        (() => {
          const terms = [
            "Name",
            "Start Date",
            "End Date",
            "Break Start",
            "Break End",
            "Booking Open Day",
            "Booking Open Time",
          ]
          return (
            <VStack>
              <Heading.h2>Semester Detail</Heading.h2>
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
            </VStack>
          )
        })()
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
              <Heading.h2>Semester Detail</Heading.h2>
              <DataList items={items} />
            </VStack>
          )
        })()
      )}
    </Container>
  )
}
