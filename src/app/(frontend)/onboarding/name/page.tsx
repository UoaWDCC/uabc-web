'use client'

import { useRouter } from 'next/navigation'

import { UabcHeaderText } from '@/components/Composite/UabcHeaderText'
import { Button } from '@/components/Generic/Button'
import { InputType, TextInput } from '@/components/Generic/TextInput'
import { useOnboardingDetailsStore } from '@/stores/useOnboardingDetailsStore'
import { Container, Spacer, Text, VStack } from '@yamada-ui/react'

export default function NamePage() {
  const router = useRouter()
  const firstName = useOnboardingDetailsStore((state) => state.firstName)
  const lastName = useOnboardingDetailsStore((state) => state.lastName)

  const updateFirstName = useOnboardingDetailsStore((state) => state.setFirstName)
  const updateLastName = useOnboardingDetailsStore((state) => state.setLastName)
  const handleFormSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()
    router.push('/onboarding/member')
  }

  return (
    <Container h="100dvh">
      <VStack h="100%">
        <UabcHeaderText />
        <Spacer />
        <VStack as="form" onSubmit={handleFormSubmit}>
          <Text textAlign="center">What&apos;s your name?</Text>
          <TextInput
            label="First Name"
            value={firstName}
            type={InputType.Text}
            isError={false}
            onChange={(e) => updateFirstName(e.target.value)}
            autoFocus
          />
          <TextInput
            label="Last Name"
            value={lastName}
            type={InputType.Text}
            isError={false}
            onChange={(e) => updateLastName(e.target.value)}
          />
          <Button type="submit" disabled={!firstName || !lastName}>
            Continue
          </Button>
        </VStack>
      </VStack>
    </Container>
  )
}
