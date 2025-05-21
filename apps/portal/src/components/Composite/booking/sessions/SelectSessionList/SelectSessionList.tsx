"use client"

import { useEffect, useMemo } from "react"

import { useCurrentGameSessions } from "@/hooks/query/game-sessions"
import { getWeekday } from "@/lib/utils"
import { convertTo12HourFormat } from "@/lib/utils/dates"
import { useCartStore } from "@/stores/useCartStore"
import { type StackProps, VStack } from "@yamada-ui/react"
import { SelectSessionCard } from "./SelectSessionCard"
import SkeletonSelectSessionCard from "./SkeletonSessionCard"

interface SelectSessionListProps extends StackProps {
  isMember: boolean
  onLimitReached: () => void
  maxSessions: number
}

export function SelectSessionList({
  onLimitReached,
  isMember,
  maxSessions,
  ...props
}: SelectSessionListProps) {
  const { data, isLoading } = useCurrentGameSessions()
  const cart = useCartStore((state) => state.cart)
  const updateCart = useCartStore((state) => state.updateCart)

  const sessions = useMemo(
    () =>
      data?.map((session) => {
        return {
          id: session.id,
          weekday: getWeekday(session.date),
          startTime: convertTo12HourFormat(session.startTime),
          endTime: convertTo12HourFormat(session.endTime),
          locationName: session.locationName,
          locationAddress: session.locationAddress,
          isFull: isMember
            ? session.memberBookingCount >= session.memberCapacity
            : session.casualBookingCount >= session.casualCapacity,
        }
      }),
    [data, isMember],
  )

  useEffect(() => {
    if (sessions) {
      const updatedCart = cart.filter((cartSession) => {
        const session = sessions.find((session) => session.id === cartSession.id)
        return session && !session.isFull
      })

      if (updatedCart.length !== cart.length) {
        updateCart(updatedCart)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, cart, updateCart])

  function handleSessionClick(id: number) {
    if (!sessions?.length) return

    const isInCart = cart.some((session) => session.id === id)

    if (!isInCart && cart.length >= maxSessions) {
      onLimitReached()
    } else if (isInCart) {
      updateCart(cart.filter((session) => session.id !== id))
    } else {
      const sessionToAdd = sessions.find((session) => session.id === id)
      if (sessionToAdd) {
        updateCart([...cart, sessionToAdd])
      }
    }
  }

  return (
    <VStack gap={3} overflowY="auto" overscrollBehavior="contain" {...props}>
      {isLoading || !sessions ? (
        <>
          <SkeletonSelectSessionCard />
          <SkeletonSelectSessionCard />
          <SkeletonSelectSessionCard />
          <SkeletonSelectSessionCard />
        </>
      ) : (
        sessions.map((session) => (
          <SelectSessionCard
            checked={cart.some((s) => s.id === session.id)}
            handleSessionClick={handleSessionClick}
            key={session.id}
            session={session}
          />
        ))
      )}
    </VStack>
  )
}
