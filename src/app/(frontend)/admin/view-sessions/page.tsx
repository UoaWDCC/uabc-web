import { Suspense } from 'react'

import { BackNavigationBar } from '@/components/BackNavigationBar'
import ClientViewSessionsPage from './client-page'
import { Container } from '@yamada-ui/react'

export const metadata = {
  title: 'View Sessions - UABC Booking Portal',
}

export default function ViewSessionsPage() {
  return (
    <Container minH="100dvh" centerContent>
      <BackNavigationBar title="View Sessions" pathName="/admin" />
      <Suspense>
        <ClientViewSessionsPage />
      </Suspense>
    </Container>
  )
}
