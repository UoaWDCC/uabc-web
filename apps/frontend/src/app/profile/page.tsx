import type { Metadata } from "next"
import { ProfileSection } from "@/components/client/user/ProfileSection"

export const metadata: Metadata = {
  title: "User Profile",
  description: "Edit your profile details and view your bookings.",
}

export default function Profile() {
  return <ProfileSection />
}
