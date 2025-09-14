import { VStack } from "@yamada-ui/react"
import { AdminClient } from "@/components/client/admin/AdminClient"

export default function Admin() {
  return (
    <VStack as="main" gap="lg" layerStyle="container" pt="md">
      <AdminClient activeIndex={0} slug="members" />
    </VStack>
  )
}
