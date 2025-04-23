'use client'

import type { MouseEventHandler } from 'react'

import { cn } from '@/lib/utils'
import { Box, Heading, Input, Text, VStack } from '@yamada-ui/react'
import { Card } from './Card'

interface MembershipTypeSelectorProps {
  selectedMembership: boolean | undefined | null
  onClick: MouseEventHandler<HTMLInputElement>
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
    <Box as="label">
      <Card
        variant={selectedMembership ? 'primary' : 'secondary'}
        className={cn('flex cursor-pointer flex-col shadow hover:opacity-90')}
      >
        <Input
          type="radio"
          display="none"
          name="membership-type-selector"
          defaultChecked={selectedMembership ?? false}
          onClick={onClick}
        />

        <Heading as="h2" fontSize="lg" fontWeight="medium">
          {heading}
        </Heading>

        <VStack gapY={0} fontSize="sm" opacity="70%">
          <Text>{description1}</Text>
          <Text>{description2}</Text>
        </VStack>
      </Card>
    </Box>
  )
}
