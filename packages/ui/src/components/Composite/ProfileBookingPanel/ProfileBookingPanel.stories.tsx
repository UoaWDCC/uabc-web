import { adminUserMock, bookingsMock, casualUserMock, memberUserMock } from "@repo/shared/mocks"
import type { Meta, StoryObj } from "@storybook/react"
import { ProfileBookingPanel } from "./ProfileBookingPanel"

const meta: Meta<typeof ProfileBookingPanel> = {
  title: "Composite Components / ProfileBookingPanel",
  component: ProfileBookingPanel,
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = StoryObj<typeof ProfileBookingPanel>

export const CasualUser: Story = {
  args: {
    bookings: bookingsMock,
    user: casualUserMock,
  },
}

export const MemberUser: Story = {
  args: {
    bookings: bookingsMock,
    user: memberUserMock,
  },
}

export const AdminUser: Story = {
  args: {
    bookings: bookingsMock,
    user: adminUserMock,
  },
}

export const ErrorState: Story = {
  args: {
    bookings: [],
    user: adminUserMock,
    error: true,
  },
}

export const EmptyState: Story = {
  args: {
    bookings: [],
    user: adminUserMock,
  },
}
