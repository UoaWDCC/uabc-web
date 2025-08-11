import { Center, Loading } from "@yamada-ui/react"
import type React from "react"
import { Suspense } from "react"
import { GuestOnly } from "@/context/RoleWrappers"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <Center>
          <Loading />
        </Center>
      }
    >
      <GuestOnly>{children}</GuestOnly>
    </Suspense>
  )
}
