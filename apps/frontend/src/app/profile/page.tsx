import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { ProfileClient } from "@/components/client/user/ProfileClient"

export const metadata: Metadata = {
  title: "User Profile",
  description: "Edit your profile details and view your bookings.",
}

export default function Profile() {
  return (
    <VStack as="main">
      <ProfileClient />
    </VStack>
  )
}
