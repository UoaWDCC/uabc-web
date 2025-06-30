"use client"

import { RadioCard, Text } from "@yamada-ui/react"
import type { ChangeEventHandler } from "react"

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
      checked={selectedMembership ?? false}
      colorScheme={selectedMembership ? "primary" : "secondary"}
      description={
        <Text>
          {description1}
          <br />
          {description2}
        </Text>
      }
      label={heading}
      name="membership-type-selector"
      onChange={onClick}
      size="lg"
      variant="surface"
    />
  )
}
