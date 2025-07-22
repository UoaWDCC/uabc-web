"use client"
import { UnAuthorised } from "@repo/ui/components/Generic"
import { ProfileSection } from "@/components/client/user/ProfileSection"
import { ProfileSectionSkeleton } from "@/components/client/user/ProfileSectionSkeleton"
import { Authenticated } from "@/context/RoleWrappers"

export const ProfileClient = () => {
  return (
    <Authenticated fallback={<UnAuthorised as="section" />} loading={<ProfileSectionSkeleton />}>
      {(auth) => <ProfileSection auth={auth} />}
    </Authenticated>
  )
}
