'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { addMonths, format, parse, subMonths } from 'date-fns'
import { z } from 'zod'

import { AdminViewSessionCard } from '@/components/admin/view-sessions/AdminViewSessionCard'
import { EmptyAdminViewSessionCard } from '@/components/admin/view-sessions/EmptyAdminViewSessionCard'
import { GameSessionProvider } from '@/components/admin/view-sessions/GameSessionContext'
import { SkeletonViewSessionCard } from '@/components/admin/view-sessions/SkeletonViewSessionCard'
import { Calendar } from '@yamada-ui/calendar'
import { prefetchActiveDates, useActiveDates } from '@/hooks/query/active-dates'
import { useGameSession } from '@/hooks/query/game-sessions'
import { convertTo12HourFormat, formatFullDate } from '@/lib/utils/dates'
import { Center, VStack } from '@yamada-ui/react'

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
  const { data, isLoading } = useGameSession(format(date, 'yyyy-MM-dd'))
  const [monthDate, setMonth] = useState(date)
  const { data: activeDates } = useActiveDates(monthDate)

  useEffect(() => {
    prefetchActiveDates(subMonths(monthDate, 1), queryClient)
    prefetchActiveDates(addMonths(monthDate, 1), queryClient)
  }, [monthDate, queryClient])

  function setDate(date: Date) {
    router.replace(pathname + '?date=' + format(date, 'yyyy-MM-dd'))
  }

  function getSessionState(date: string | Date, startTimeString: string, endTimeString: string) {
    const now = new Date()
    const startTime = parse(startTimeString, 'HH:mm:ss', date)
    const endTime = parse(endTimeString, 'HH:mm:ss', date)

    if (endTime < now) {
      return 'past'
    }
    if (startTime > now) {
      return 'upcoming'
    }
    return 'ongoing'
  }

  const _ = useMemo(() => activeDates?.map((date) => new Date(date)) ?? [], [activeDates])

  const value = useMemo(() => {
    return {
      date: format(date, 'yyyy-MM-dd'),
      canCreate: data?.canCreate ?? false,
      ...data?.data,
    }
  }, [date, data])

  return (
    <Center as={VStack} maxW="md">
      <Calendar
        borderWidth="1px"
        rounded="md"
        p="md"
        today
        value={date}
        onChange={(date: Date | undefined) => {
          setDate(date ?? new Date())
          if (date?.getMonth() !== monthDate.getMonth()) {
            setMonth(date ?? new Date())
          }
        }}
        labelProps={{ mx: 'md', h: '8' }}
        prevProps={{ variant: 'outline', w: '8', h: '8' }}
        nextProps={{ variant: 'outline', w: '8', h: '8' }}
        colorScheme="primary"
      />
      <GameSessionProvider value={value}>
        {isLoading ? (
          <SkeletonViewSessionCard />
        ) : data?.exists ? (
          <AdminViewSessionCard
            id={data.data.id}
            title={formatFullDate(date).toLocaleString()}
            startTime={convertTo12HourFormat(data.data.startTime)}
            endTime={convertTo12HourFormat(data.data.endTime)}
            locationName={data.data.locationName}
            locationAddress={data.data.locationAddress}
            attendees={data.data.attendees}
            totalCapacity={data.data.memberCapacity + data.data.casualCapacity}
            state={getSessionState(data.data.date, data.data.startTime, data.data.endTime)}
          />
        ) : (
          <EmptyAdminViewSessionCard />
        )}
      </GameSessionProvider>
    </Center>
  )
}
