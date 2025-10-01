import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { AdminClient } from "@/components/client/admin/AdminClient"

export const metadata: Metadata = {
  title: "Manage Members",
  description: "Manage members through the administrator dashboard.",
}

export default function Admin() {
  return (
    <VStack as="main" gap="lg" layerStyle="container" pt="md">
      <AdminClient activeIndex={0} slug="members" />
    </VStack>
  )
}
