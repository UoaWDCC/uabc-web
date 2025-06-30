"use client"

import { Heading } from "@repo/ui/components/Heading"
import { Container, Spacer, Text, VStack } from "@yamada-ui/react"
import { PaymentInfoCard } from "@/components/Composite/payment/PaymentInfoCard"
import { PaymentOptionCard } from "@/components/Composite/payment/PaymentOptionCard"

export default function PaymentOptionsPage() {
  return (
    <Container h="100dvh">
      <VStack>
        <Heading>Payment</Heading>

        <PaymentInfoCard amount={15} />
      </VStack>
      <Spacer />
      <VStack>
        <Text fontWeight="medium" textAlign="center">
          Please select a payment method:
        </Text>
        <VStack>
          <PaymentOptionCard
            onClick={() => alert("Direct debit")}
            subtitle="Pay via Bank Transfer"
            title="Direct Debit"
          />
          <PaymentOptionCard
            onClick={() => alert("Pay now")}
            subtitle="Pay via a Debit or Credit Card"
            title="Pay Now"
          />
        </VStack>
      </VStack>
    </Container>
  )
}
