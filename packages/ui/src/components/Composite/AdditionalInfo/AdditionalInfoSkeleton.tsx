import { UserProfileCardSkeleton } from "@repo/ui/components/Generic/UserProfileCard/UserProfileCardSkeleton"
import type { FC } from "react"

export const AdditionalInfoSkeleton: FC = () => (
  <UserProfileCardSkeleton
    fieldLabels={["Gender", "Play Level", "Dietary Requirements"]}
    title="Additional Info"
  />
)
