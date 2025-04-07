import { Members } from '@/components/admin/members/MemberManagementTable'
import { BackNavigationBar } from '@/components/BackNavigationBar'
import { Container, Heading, VStack } from '@yamada-ui/react'

export const metadata = {
  title: 'Members - UABC Booking Portal',
}

export default function AdminMembersPage() {
  return (
    <Container minH="100dvh">
      <BackNavigationBar title="Members" pathName="/admin" />
      <VStack>
        <Heading fontSize="2xl" fontWeight="semibold">
          Member Management
        </Heading>
        <Members />
      </VStack>
    </Container>
  )
}
