/**
 * @author David Zhu <dzhu292@aucklanduni.ac.nz>
 */

"use client"

import { DebitDetailsCard } from "@/components/Composite/payment/DebitDetailsCard"
import { PaymentInfoCard } from "@/components/Composite/payment/PaymentInfoCard"
import { Heading } from "@repo/ui/components/Heading"
import { Button, Container, Spacer, Text, VStack } from "@yamada-ui/react"

export default function DirectDebitPage() {
  const firstName = "John"
  const lastName = "Smith"
  const sessionId = "rn3498"
  const accountNumber = "xx-xxxx-xxxx-xxx"

  return (
    // TODO: Add functionality for DONE button
    // TODO: Link name, payment components to backend
    <Container h="100dvh">
      <VStack>
        <Heading>Payment</Heading>
        <PaymentInfoCard amount={15} />
      </VStack>
      <Spacer />
      <VStack>
        <Text fontWeight="medium" textAlign="center">
          Direct Debit
        </Text>
        <VStack>
          <DebitDetailsCard
            copyText={accountNumber}
            subtitle={accountNumber}
            title="Account Number:"
          />
          <DebitDetailsCard
            copyText={sessionId}
            sessionId={sessionId}
            subtitle={`${firstName} ${lastName}`}
            title="Reference:"
          />
        </VStack>
        <Button colorScheme="primary" onClick={() => alert("DONE")}>
          Done
        </Button>
      </VStack>
    </Container>
  )
}
