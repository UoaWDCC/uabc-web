/**
 * @author Angela Guo <aguo921@aucklanduni.ac.nz>
 */

'use client'

import { Heading } from '@/components/Heading'
import { PaymentInfoCard } from '@/components/payment/PaymentInfoCard'
import { PaymentOptionCard } from '@/components/payment/PaymentOptionCard'
import { Container, Spacer, Text, VStack } from '@yamada-ui/react'

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
            onClick={() => alert('Direct debit')}
            title="Direct Debit"
            subtitle="Pay via Bank Transfer"
          />
          <PaymentOptionCard
            onClick={() => alert('Pay now')}
            title="Pay Now"
            subtitle="Pay via a Debit or Credit Card"
          />
        </VStack>
      </VStack>
    </Container>
  )
}
