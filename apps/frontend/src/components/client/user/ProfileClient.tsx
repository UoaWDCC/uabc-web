"use client"
import { NotAuthorised } from "@repo/ui/components/Generic"
import { ProfileSection } from "@/components/client/user/ProfileSection"
import { ProfileSectionSkeleton } from "@/components/client/user/ProfileSectionSkeleton"
import { RoleGuard } from "@/context/RoleWrappers"

export const ProfileClient = () => {
  return (
    <RoleGuard
      fallback={
        <NotAuthorised
          as="section"
          description="Please login to view your profile"
          href="/auth/login"
          returnLabel="Login"
          title="You are not logged in"
        />
      }
      loading={<ProfileSectionSkeleton />}
    >
      {(auth) => <ProfileSection auth={auth} />}
    </RoleGuard>
  )
}
