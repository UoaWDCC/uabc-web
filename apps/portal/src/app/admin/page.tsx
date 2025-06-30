import { Heading } from "@repo/ui/components/Heading"
import { CalendarClockIcon, CalendarDaysIcon, UserCheckIcon, UsersIcon } from "@yamada-ui/lucide"
import { Container, VStack } from "@yamada-ui/react"
import { DashboardButton } from "@/components/Composite/admin/DashboardButton"
import { MemberApprovalPing } from "@/components/Composite/admin/members/MemberApprovalPing"

export const metadata = {
  title: "Admin Dashboard - UABC Booking Portal",
}

export default async function AdminDashboardPage() {
  return (
    <Container h="100dvh">
      <VStack>
        <Heading>Dashboard</Heading>
        <DashboardButton
          href="/admin/view-sessions"
          startIcon={<CalendarDaysIcon fontSize={24} minW="6" />}
        >
          View Sessions
        </DashboardButton>
        <DashboardButton
          href="/admin/semesters"
          startIcon={<CalendarClockIcon fontSize={24} minW="6" />}
        >
          Edit Semester Schedules
        </DashboardButton>
        <DashboardButton
          className="relative"
          href="/admin/members"
          startIcon={<UsersIcon fontSize={24} minW="6" />}
        >
          Manage Members
        </DashboardButton>
        {/* TODO: Possibly replace with lucide icon */}
        <DashboardButton
          className="relative"
          href="/admin/member-approval"
          startIcon={<UserCheckIcon fontSize={24} minW="6" />}
        >
          <MemberApprovalPing />
          {/* <BsPersonFillCheck size={24} /> */}
          Approve Members
        </DashboardButton>
      </VStack>
    </Container>
  )
}
