"use client"

import { Button, Heading } from "@repo/ui/components/Primitive"
import { CheckIcon } from "@yamada-ui/lucide"
import { Center, memo, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"

export type RegisterSuccessPanelValues = {
  agree: boolean
}

/**
 * Final component of the register flow, with a button to navigate the user out.
 *
 * @remarks No screen responsivity is implemented in this component; responsivity between mobile and
 * desktop screens should be implemented in the wrapper components
 *
 * @param props RegisterSuccessPanel component props
 * @returns The register success component
 */
export const RegisterSuccessPanel: FC = memo(() => {
  return (
    <VStack bgColor="inherit" gap="lg" h="full">
      <Center
        borderColor="white"
        borderRadius="full"
        borderWidth="thick"
        p="sm"
        placeSelf="center"
        w="fit-content"
      >
        <CheckIcon fontSize="9xl" />
      </Center>
      <VStack>
        <Heading.h2 textAlign="center">Success!</Heading.h2>
        <Text color="muted" textAlign="center">
          Your account has been created. Welcome to UABC!
        </Text>
      </VStack>

      {/* TODO: use correct href for profile dashboard */}
      <Button as={Link} colorScheme="primary" href="/">
        Profile Dashboard
      </Button>
    </VStack>
  )
})

RegisterSuccessPanel.displayName = "RegisterSuccessPanel"
