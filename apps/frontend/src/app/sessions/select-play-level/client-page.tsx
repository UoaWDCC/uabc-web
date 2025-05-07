"use client"

import { redirect, useRouter } from "next/navigation"
import { useMemo } from "react"

import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"
import { ExpandedSessionCard } from "@/components/Composite/booking/sessions/ExpandedSessionCard"
import { useBookingMutation } from "@/hooks/mutations/booking"
import { useCartStore } from "@/stores/useCartStore"
import { PlayLevel } from "@/types/types"
import { Box, Button, Container, Flex, For, VStack, useNotice } from "@yamada-ui/react"

export default function ClientSelectPlayLevelPage() {
  const router = useRouter()

  const cart = useCartStore((state) => state.cart)
  const notice = useNotice()

  const { mutate, isPending } = useBookingMutation()

  const sortedSessions = useMemo(() => {
    return [...cart].sort((a, b) => {
      const weekdays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]
      return weekdays.indexOf(a.weekday) - weekdays.indexOf(b.weekday)
    })
  }, [cart])

  const isPlayLevelSelected = cart.every((session) => session.playLevel !== undefined)

  const handleConfirmButtonClick = async () => {
    const payload = sortedSessions.map((session) => ({
      gameSessionId: session.id,
      playLevel: session.playLevel ?? PlayLevel.beginner, // Provide a default if undefined
    }))

    mutate(payload, {
      onSuccess: (id) => {
        router.push(`/booking-confirmation/${id}`)
        router.refresh()
      },
      onError: (e) => {
        const code = e.message

        if (code === "SESSION_FULL") {
          notice({
            title: "Session Full",
            description:
              "Unfortunately, one of the sessions you selected is now full. Please choose another session.",
            status: "error",
            placement: "bottom-right",
            isClosable: true,
          })
        } else if (code === "ALREADY_BOOKED") {
          notice({
            title: "Session Already Booked",
            description: "You have already booked this session. Please select a different session.",
            status: "error",
            placement: "bottom-right",
            isClosable: true,
          })
        } else if (code === "LIMIT_REACHED") {
          notice({
            title: "Maximum booking limit reached.",
            description: "You have already reached the session booking limit for this week.",
            status: "error",
            placement: "bottom-right",
            isClosable: true,
          })
        } else if (code === "TOO_MANY_REQUESTS") {
          notice({
            title: "Too Many Requests",
            description:
              "You have made too many booking requests in a short period. Please wait a moment and try again.",
            status: "error",
            placement: "bottom-right",
            isClosable: true,
          })
        } else {
          notice({
            title: "Something went wrong.",
            description: "An error occurred while confirming your booking. Please try again.",
            status: "error",
            placement: "bottom-right",
            isClosable: true,
          })
        }

        router.push("/sessions")
      },
    })
  }

  if (!cart.length) {
    redirect("/sessions")
  }

  return (
    <Container h="100dvh">
      <VStack h="100%">
        <BackNavigationBar pathName="/sessions" title="Select your level of play" />

        <For each={sortedSessions}>
          {(session) => (
            <Box key={session.id} marginBottom="md">
              <ExpandedSessionCard gameSession={session} />
            </Box>
          )}
        </For>

        <Flex flexGrow={1} marginBottom={10}>
          <Button
            alignSelf="end"
            colorScheme="primary"
            disabled={!isPlayLevelSelected || isPending}
            onClick={handleConfirmButtonClick}
            width="full"
          >
            Confirm
          </Button>
        </Flex>
      </VStack>
    </Container>
  )
}
