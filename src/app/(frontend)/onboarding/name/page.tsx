'use client'

import { useRouter } from 'next/navigation'

import { UabcHeaderText } from '@/components/Composite/UabcHeaderText'
import { TextInput } from '@/components/Generic/TextInput/TextInput'
import { Button } from '@/components/Generic/ui/button'
import { useOnboardingDetailsStore } from '@/stores/useOnboardingDetailsStore'

export default function NamePage() {
  const router = useRouter()
  const firstName = useOnboardingDetailsStore((state) => state.firstName)
  const lastName = useOnboardingDetailsStore((state) => state.lastName)

  const updateFirstName = useOnboardingDetailsStore((state) => state.setFirstName)
  const updateLastName = useOnboardingDetailsStore((state) => state.setLastName)
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push('/onboarding/member')
  }

  return (
    <div className="h-dvh w-dvw">
      <div className="mx-4 flex h-full flex-col justify-between">
        <div className="pt-4">
          <UabcHeaderText />
        </div>
        <form className="flex flex-col gap-6 py-6" onSubmit={handleFormSubmit}>
          <p className="text-center">What&apos;s your name?</p>
          <TextInput
            label="First Name"
            value={firstName}
            type="text"
            isError={false}
            onChange={(e) => updateFirstName(e.target.value)}
            autoFocus
          />
          <TextInput
            label="Last Name"
            value={lastName}
            type="text"
            isError={false}
            onChange={(e) => updateLastName(e.target.value)}
          />
          <div className="pb-10">
            <Button large className="w-full" type="submit" disabled={!firstName || !lastName}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
