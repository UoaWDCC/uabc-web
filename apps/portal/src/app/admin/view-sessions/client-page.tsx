"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Calendar } from "@yamada-ui/calendar"
import { Center, VStack } from "@yamada-ui/react"
import { addMonths, format, parse, subMonths } from "date-fns"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { AdminViewSessionCard } from "@/components/Composite/admin/view-sessions/AdminViewSessionCard"
import { EmptyAdminViewSessionCard } from "@/components/Composite/admin/view-sessions/EmptyAdminViewSessionCard"
import { GameSessionProvider } from "@/components/Composite/admin/view-sessions/GameSessionContext"
import { SkeletonViewSessionCard } from "@/components/Composite/admin/view-sessions/SkeletonViewSessionCard"
import { prefetchActiveDates, useActiveDates } from "@/hooks/query/active-dates"
import { useGameSession } from "@/hooks/query/game-sessions"
import { convertTo12HourFormat, formatFullDate } from "@/lib/utils/dates"

const searchParamsSchema = z.object({
  date: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return new Date()
      return new Date(val)
    })
    .pipe(z.date()),
})

export default function ClientViewSessionsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { date } = useMemo(() => {
    return searchParamsSchema.parse(Object.fromEntries(searchParams))
  }, [searchParams])

  const queryClient = useQueryClient()
  const { data, isLoading } = useGameSession(format(date, "yyyy-MM-dd"))
  const [monthDate, setMonth] = useState(date)
  const { data: activeDates } = useActiveDates(monthDate)

  useEffect(() => {
    prefetchActiveDates(subMonths(monthDate, 1), queryClient)
    prefetchActiveDates(addMonths(monthDate, 1), queryClient)
  }, [monthDate, queryClient])

  function setDate(date: Date) {
    router.replace(`${pathname}?date=${format(date, "yyyy-MM-dd")}`)
  }

  function getSessionState(date: string | Date, startTimeString: string, endTimeString: string) {
    const now = new Date()
    const startTime = parse(startTimeString, "HH:mm:ss", date)
    const endTime = parse(endTimeString, "HH:mm:ss", date)

    if (endTime < now) {
      return "past"
    }
    if (startTime > now) {
      return "upcoming"
    }
    return "ongoing"
  }

  const _ = useMemo(() => activeDates?.map((date) => new Date(date)) ?? [], [activeDates])

  const value = useMemo(() => {
    return {
      date: format(date, "yyyy-MM-dd"),
      canCreate: data?.canCreate ?? false,
      ...data?.data,
    }
  }, [date, data])

  return (
    <Center as={VStack} maxW="md">
      <Calendar
        borderWidth="1px"
        colorScheme="primary"
        labelProps={{ mx: "md", h: "8" }}
        nextProps={{ variant: "outline", w: "8", h: "8" }}
        onChange={(date: Date | undefined) => {
          setDate(date ?? new Date())
          if (date?.getMonth() !== monthDate.getMonth()) {
            setMonth(date ?? new Date())
          }
        }}
        p="md"
        prevProps={{ variant: "outline", w: "8", h: "8" }}
        rounded="md"
        today
        value={date}
      />
      <GameSessionProvider value={value}>
        {isLoading ? (
          <SkeletonViewSessionCard />
        ) : data?.exists ? (
          <AdminViewSessionCard
            attendees={data.data.attendees}
            endTime={convertTo12HourFormat(data.data.endTime)}
            id={data.data.id}
            locationAddress={data.data.locationAddress}
            locationName={data.data.locationName}
            startTime={convertTo12HourFormat(data.data.startTime)}
            state={getSessionState(data.data.date, data.data.startTime, data.data.endTime)}
            title={formatFullDate(date).toLocaleString()}
            totalCapacity={data.data.memberCapacity + data.data.casualCapacity}
          />
        ) : (
          <EmptyAdminViewSessionCard />
        )}
      </GameSessionProvider>
    </Center>
  )
}
