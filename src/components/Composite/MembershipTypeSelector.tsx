'use client'

import type { ChangeEventHandler } from 'react'

import { RadioCard, Text } from '@yamada-ui/react'

interface MembershipTypeSelectorProps {
  selectedMembership: boolean | undefined | null
  onClick: ChangeEventHandler<HTMLInputElement>
  heading: string
  description1: string
  description2: string
}

export const MembershipTypeSelector = ({
  selectedMembership,
  onClick,
  heading,
  description1,
  description2,
}: MembershipTypeSelectorProps) => {
  return (
    <RadioCard
      name="membership-type-selector"
      label={heading}
      description={
        <Text>
          {description1}
          <br />
          {description2}
        </Text>
      }
      checked={selectedMembership ?? false}
      variant="surface"
      colorScheme={selectedMembership ? 'primary' : 'secondary'}
      size="lg"
      onChange={onClick}
    />
  )
}
