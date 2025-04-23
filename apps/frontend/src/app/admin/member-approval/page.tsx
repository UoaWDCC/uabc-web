import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"
import { MemberApprovalTable } from "@/components/Composite/admin/members/MemberApprovalTable"
import { Container, Heading, Text, VStack } from "@yamada-ui/react"

export const metadata = {
  title: "Member Approval - UABC Booking Portal",
}

export default function AdminMemberApprovalPage() {
  return (
    <Container minH="100dvh" centerContent>
      <BackNavigationBar title="Members" pathName="/admin" />
      <VStack maxW="6xl">
        <Heading fontSize="2xl" fontWeight="semibold">
          Approve Members
        </Heading>
        <Text color="muted">Here&apos;s a list of members currently awaiting approval</Text>
        <MemberApprovalTable />
      </VStack>
    </Container>
  )
}
