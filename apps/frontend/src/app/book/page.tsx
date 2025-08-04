import { BookingConfirmedPopup } from "@repo/ui/components/Composite"
import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { BookClient } from "@/components/client/book/BookClient"

export const metadata: Metadata = {
  title: "Book",
  description: "Check back later for booking functionality!",
}

export default function Book() {
  return (
    <VStack as="main">
      <BookClient />
      <BookingConfirmedPopup
        additionalMessage="You can now book a court"
        message="Booking confirmed"
        title="Booking confirmed"
      />
    </VStack>
  )
}
