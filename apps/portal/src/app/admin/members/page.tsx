import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"
import { Members } from "@/components/Composite/admin/members/MemberManagementTable"
import { Container, Heading, VStack } from "@yamada-ui/react"

export const metadata = {
  title: "Members - UABC Booking Portal",
}

export default function AdminMembersPage() {
  return (
    <Container centerContent minH="100dvh">
      <BackNavigationBar pathName="/admin" title="Members" />
      <VStack maxW="6xl">
        <Heading fontSize="2xl" fontWeight="semibold">
          Member Management
        </Heading>
        <Members />
      </VStack>
    </Container>
  )
}
