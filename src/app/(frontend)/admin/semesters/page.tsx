import SemesterCreateButton from '@/components/admin/semesters/SemesterCreateButton'
import { SemestersList } from '@/components/admin/semesters/SemestersList'
import { BackNavigationBar } from '@/components/BackNavigationBar'
import { Container, Spacer, VStack } from '@yamada-ui/react'

export const metadata = {
  title: 'Semesters - UABC Booking Portal',
}

const SemestersPage = () => {
  return (
    <Container minH="100dvh">
      <BackNavigationBar title="Semesters" pathName="/admin">
        <Spacer />
        <SemesterCreateButton />
      </BackNavigationBar>
      <VStack>
        <SemestersList />
      </VStack>
    </Container>
  )
}

export default SemestersPage
