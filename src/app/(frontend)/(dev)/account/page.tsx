import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'

import type { CurrentUserProps } from '@/lib/hoc/withCurrentUser'
import withCurrentUser from '@/lib/hoc/withCurrentUser'
import { getUserFromId } from '@/services/user'
import { PlayLevel } from '@/types/types'
import { BackNavigationBar } from '@/components/Composite/BackNavigationBar'
import ClientAccountForm from './client-page'
import { Center, Container, Loading, Spacer, Tag, Text, VStack } from '@yamada-ui/react'

export const metadata = {
  title: 'Account Settings - UABC Booking Portal',
}

async function AccountPage({ currentUser }: CurrentUserProps) {
  const user = await getUserFromId(currentUser.id)

  // Check if the user or any required fields are missing
  if (!user || !user.firstName || !user.lastName || !user.email) {
    // Redirect to login if any required fields are missing
    redirect('/auth/login')
  }

  const playLevel: PlayLevel = user?.playLevel ?? PlayLevel.beginner

  return (
    <Container h="100dvh">
      <VStack>
        <BackNavigationBar title="Account" pathName="/sessions">
          <Spacer />
          <Suspense fallback={<Text>Loading...</Text>}>
            <Tag colorScheme="tertiary" rounded="full" variant="solid" size="sm">
              {user?.member ? 'Member' : 'Non-member'}
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
            firstName={user?.firstName || ''}
            lastName={user?.lastName || ''}
            email={user?.email || ''}
            playLevel={playLevel}
            member={user?.member || false}
          />
        </Suspense>
      </VStack>
    </Container>
  )
}

export default withCurrentUser(AccountPage)
