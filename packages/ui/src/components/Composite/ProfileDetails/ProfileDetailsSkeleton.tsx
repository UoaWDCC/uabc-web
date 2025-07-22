import { UserProfileCardSkeleton } from "@repo/ui/components/Generic/UserProfileCard/UserProfileCardSkeleton"
import type { FC } from "react"

export const ProfileDetailsSkeleton: FC = () => (
  <UserProfileCardSkeleton
    fieldLabels={["First Name", "Last Name", "Email Address", "Phone Number"]}
    title="Profile Details"
  />
)
