import { AdminPage } from "@repo/shared/types"
import { VStack } from "@yamada-ui/react"
import type { Metadata } from "next"
import { AdminClient } from "@/components/client/admin/AdminClient"

export const metadata: Metadata = {
  title: "Admin Members page",
  description: "View members",
}

export default function Admin() {
  return (
    <VStack as="main">
      <AdminClient view={AdminPage.VIEW_MEMBERS} />
    </VStack>
  )
}
