/**
 * @author David Zhu <dzhu292@aucklanduni.ac.nz>
 */

'use client'

import { Heading } from '@/components/Heading'
import { DebitDetailsCard } from '@/components/payment/DebitDetailsCard'
import { PaymentInfoCard } from '@/components/payment/PaymentInfoCard'
import { Button } from '@/components/ui/button'

export default function DirectDebitPage() {
  const firstName = 'John'
  const lastName = 'Smith'
  const sessionId = 'rn3498'
  const accountNumber = 'xx-xxxx-xxxx-xxx'

  return (
    // TODO: Add functionality for DONE button
    // TODO: Link name, payment components to backend
    <div className="flex h-dvh flex-col">
      <Heading className="pb-4 pl-6 pt-10">Payment</Heading>
      <PaymentInfoCard amount={15} className="mx-10" />
      <p className="flex grow flex-col-reverse py-3 text-center font-medium">Direct Debit</p>
      <div className="mx-10 flex flex-col gap-3 overflow-y-auto overscroll-contain py-2">
        <DebitDetailsCard
          title="Account Number:"
          subtitle={accountNumber}
          copyText={accountNumber}
        />

        <DebitDetailsCard
          title="Reference:"
          subtitle={`${firstName} ${lastName}`}
          sessionId={sessionId}
          copyText={sessionId}
        />
      </div>
      <div className="mx-10 mb-10 mt-5 flex justify-center">
        <Button large onClick={() => alert('DONE')}>
          Done
        </Button>
      </div>
    </div>
  )
}
