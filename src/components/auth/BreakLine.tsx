import { HStack, Separator, Text } from '@yamada-ui/react'
import React from 'react'

export const BreakLine = ({ label }: { label: string }) => {
  return (
    <HStack>
      <Separator />
      <Text color="tertiary" fontSize="xs">
        {label}
      </Text>
      <Separator />
    </HStack>
  )
}
