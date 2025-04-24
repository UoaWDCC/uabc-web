'use client'

import { redirect, useRouter } from 'next/navigation'

import { BackNavigationBar } from '@/components/Composite/BackNavigationBar'
import { MembershipTypeSelector } from '@/components/Composite/MembershipTypeSelector'
import { Button } from '@/components/Generic/Button'
import { Container, RadioCardGroup, Spacer, VStack } from '@yamada-ui/react'

import { useOnboardingDetailsStore } from '@/stores/useOnboardingDetailsStore'

const MembershipType = () => {
  const member = useOnboardingDetailsStore((state) => state.member)
  const setMember = useOnboardingDetailsStore((state) => state.setMember)
  const firstName = useOnboardingDetailsStore((state) => state.firstName)
  const lastName = useOnboardingDetailsStore((state) => state.lastName)
  const router = useRouter()

  if (!firstName || !lastName) {
    redirect('/onboarding/name')
  }

  const handleNextButtonClick = async () => {
    try {
      // TODO: Replace
      const response = await fetch(`/api/users/id/onboard`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, member }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user details')
      }
      /**
       * TODO:
       await update({
       firstName,
       lastName,
       member,
       });
       */

      router.push('/sessions')
    } catch (error) {
      console.error('An error occurred while updating user details:', error)
    }
  }

  const toggleMemberSelection = (selected: boolean) => {
    setMember(member === selected ? null : selected)
  }

  return (
    <Container h="100dvh">
      <VStack h="100%">
        <BackNavigationBar title="Select your membership type" pathName="/onboarding/name" />

        <RadioCardGroup withIcon={false} direction="column">
          <MembershipTypeSelector
            selectedMembership={member === true}
            onClick={() => toggleMemberSelection(true)}
            heading="Prepaid Member"
            description1="Package of 6, 11 or 22 prepaid sessions for the semester"
            description2="(limit of 2 sessions per week)"
          />

          <MembershipTypeSelector
            selectedMembership={member === false}
            onClick={() => toggleMemberSelection(false)}
            heading="Non-Member (Casual)"
            description1="$8.00 per session"
            description2="(limit of 1 session per week)"
          />
        </RadioCardGroup>

        <Spacer />

        <Button onClick={handleNextButtonClick} disabled={member === null}>
          Next
        </Button>
      </VStack>
    </Container>
  )
}

export default MembershipType
