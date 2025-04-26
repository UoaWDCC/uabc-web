"use client"

import { redirect, useRouter } from "next/navigation"
import { useMemo } from "react"

import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"
import { ExpandedSessionCard } from "@/components/Composite/booking/sessions/ExpandedSessionCard"
import { Button } from "@/components/Generic/ui/button"
import { useToast } from "@/components/Generic/ui/use-toast"
import { useBookingMutation } from "@/hooks/mutations/booking"
import { useCartStore } from "@/stores/useCartStore"
import { PlayLevel } from "@/types/types"

export default function ClientSelectPlayLevelPage() {
  const router = useRouter()

  const cart = useCartStore((state) => state.cart)
  const { toast } = useToast()

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
          toast({
            title: "Session Full",
            description:
              "Unfortunately, one of the sessions you selected is now full. Please choose another session.",
            variant: "destructive",
          })
        } else if (code === "ALREADY_BOOKED") {
          toast({
            title: "Session Already Booked",
            description: "You have already booked this session. Please select a different session.",
            variant: "destructive",
          })
        } else if (code === "LIMIT_REACHED") {
          toast({
            title: "Maximum booking limit reached.",
            description: "You have already reached the session booking limit for this week.",
            variant: "destructive",
          })
        } else if (code === "TOO_MANY_REQUESTS") {
          toast({
            title: "Too Many Requests",
            description:
              "You have made too many booking requests in a short period. Please wait a moment and try again.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Something went wrong.",
            description: "An error occurred while confirming your booking. Please try again.",
            variant: "destructive",
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
    <div className="mx-4 flex h-dvh flex-col gap-y-4">
      <BackNavigationBar pathName="/sessions" title="Select your level of play" />

      {sortedSessions.map((session) => (
        <div className="mb-4" key={session.id}>
          <ExpandedSessionCard gameSession={session} />
        </div>
      ))}

      <div className="mb-10 flex flex-grow">
        <Button
          className="w-full self-end"
          disabled={!isPlayLevelSelected || isPending}
          onClick={handleConfirmButtonClick}
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}
