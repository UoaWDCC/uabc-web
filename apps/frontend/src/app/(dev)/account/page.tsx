import { redirect } from "next/navigation"
import { Suspense } from "react"

import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"
import type { CurrentUserProps } from "@/lib/hoc/withCurrentUser"
import withCurrentUser from "@/lib/hoc/withCurrentUser"
import { getUserFromId } from "@/services/user"
import { PlayLevel } from "@/types/types"
import { Center, Container, Loading, Spacer, Tag, Text, VStack } from "@yamada-ui/react"
import ClientAccountForm from "./client-page"

export const metadata = {
  title: "Account Settings - UABC Booking Portal",
}

async function AccountPage({ currentUser }: CurrentUserProps) {
  // @ts-ignore
  const user = await getUserFromId(currentUser.id)

  // Check if the user or any required fields are missing
  if (!user || !user.firstName || !user.lastName || !user.email) {
    // Redirect to login if any required fields are missing
    redirect("/auth/login")
  }

  const playLevel: PlayLevel = user?.playLevel ?? PlayLevel.beginner

  return (
    <Container h="100dvh">
      <VStack>
        <BackNavigationBar pathName="/sessions" title="Account">
          <Spacer />
          <Suspense fallback={<Text>Loading...</Text>}>
            <Tag colorScheme="tertiary" rounded="full" size="sm" variant="solid">
              {user?.member ? "Member" : "Non-member"}
            </Tag>
          </Suspense>
        </BackNavigationBar>

        <Suspense
          fallback={
            <Center>
              <Loading />
            </Center>
          }
        >
          <ClientAccountForm
            email={user?.email || ""}
            firstName={user?.firstName || ""}
            lastName={user?.lastName || ""}
            member={user?.member || false}
            playLevel={playLevel}
          />
        </Suspense>
      </VStack>
    </Container>
  )
}

export default withCurrentUser(AccountPage)
