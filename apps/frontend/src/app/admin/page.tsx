import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { AdminClient } from "@/components/client/admin/AdminClient"

export const metadata: Metadata = {
  title: "Admin page",
  description: "Manage members, sessions and semesters.",
}

export default function Admin() {
  return (
    <VStack as="main" pt="md">
      <AdminClient />
    </VStack>
  )
}
