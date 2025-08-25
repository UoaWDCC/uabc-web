"use client"

import { Button, Heading } from "@repo/ui/components/Primitive"
import { Alert, AlertDescription, AlertIcon, AlertTitle, memo, VStack } from "@yamada-ui/react"
import Link from "next/link"
import type { FC } from "react"

/**
 * Final component of the register flow, with a button to navigate the user out.
 *
 * @remarks No screen responsiveness is implemented in this component; responsiveness between mobile and
 * desktop screens should be implemented in the wrapper components
 *
 * @param props RegisterSuccessPanel component props
 * @returns The register success component
 */
export const RegisterSuccessPanel: FC = memo(() => {
  return (
    <VStack bgColor="inherit" gap="lg" h="full">
      <Alert
        alignItems="center"
        bg="inherit"
        border={0}
        flexDir="column"
        flexGrow={1}
        gap="sm"
        justifyContent="center"
        status="success"
        textAlign="center"
      >
        <AlertIcon boxSize="80px" />
        <AlertTitle as={Heading.h3}>Success!</AlertTitle>
        <AlertDescription textWrap="wrap">
          Your account has been created. Welcome to UABC!
        </AlertDescription>
      </Alert>

      <Button as={Link} colorScheme="primary" href="/profile">
        Profile Dashboard
      </Button>
    </VStack>
  )
})

RegisterSuccessPanel.displayName = "RegisterSuccessPanel"
