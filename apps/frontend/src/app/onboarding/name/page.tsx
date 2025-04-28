"use client"

import { useRouter } from "next/navigation"

import { UabcHeaderText } from "@/components/Composite/UabcHeaderText"
import { useOnboardingDetailsStore } from "@/stores/useOnboardingDetailsStore"
import { Button } from "@repo/ui/components/Button"
import { InputType, TextInput } from "@repo/ui/components/TextInput"
import { Container, Spacer, Text, VStack } from "@yamada-ui/react"

export default function NamePage() {
  const router = useRouter()
  const firstName = useOnboardingDetailsStore((state) => state.firstName)
  const lastName = useOnboardingDetailsStore((state) => state.lastName)

  const updateFirstName = useOnboardingDetailsStore((state) => state.setFirstName)
  const updateLastName = useOnboardingDetailsStore((state) => state.setLastName)
  const handleFormSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()
    router.push("/onboarding/member")
  }

  return (
    <Container h="100dvh">
      <VStack h="100%">
        <UabcHeaderText />
        <Spacer />
        <VStack as="form" onSubmit={handleFormSubmit}>
          <Text textAlign="center">What&apos;s your name?</Text>
          <TextInput
            autoFocus
            isError={false}
            label="First Name"
            onChange={(e) => updateFirstName(e.target.value)}
            type={InputType.Text}
            value={firstName}
          />
          <TextInput
            isError={false}
            label="Last Name"
            onChange={(e) => updateLastName(e.target.value)}
            type={InputType.Text}
            value={lastName}
          />
          <Button colorScheme="primary" disabled={!firstName || !lastName} type="submit">
            Continue
          </Button>
        </VStack>
      </VStack>
    </Container>
  )
}
