import Link from 'next/link'

import { UabcHeaderText } from '@/components/Composite/UabcHeaderText'
import { CartClearer } from '@/components/Composite/booking/confirmation/CartClearer'
import ConfirmationMessage from '@/components/Composite/booking/confirmation/ConfirmationMessage'
import { buttonVariants } from '@/components/Generic/ui/button'
import type { CurrentUserProps } from '@/lib/hoc/withCurrentUser'
import withCurrentUser from '@/lib/hoc/withCurrentUser'

export const metadata = {
  title: 'Booking Confirmation - UABC Booking Portal',
}

async function ConfirmationPage(
  props: CurrentUserProps & { params: Promise<{ bookingId: string }> },
) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative flex h-32 items-center justify-center overflow-hidden">
        <div className="absolute -z-10 h-full w-[120%] rounded-b-[50%] bg-secondary md:w-[110%]"></div>
        <Link href="/">
          <UabcHeaderText className="mt-4" />
        </Link>
      </div>

      <div className="mx-4 flex grow flex-col items-center justify-center gap-6 py-10">
        {
          /**
           * // TODO
           */
          // @ts-ignore
          <ConfirmationMessage member={false} email={await props.currentUser.email} />
        }
        <Link href="/sessions" className={buttonVariants({ variant: 'ghost' })}>
          Return Home
        </Link>
      </div>

      <div className="flex flex-col gap-4 bg-primary p-4 pb-6 pt-5">
        <p className="text-xl font-semibold text-primary-foreground">Rackets at the ready!</p>
        {
          // TODO: fetch actual data
          /**
           sessions.map((session) => (
           <ConfirmedSessionCard
           key={session.id}
           weekDay={getWeekday(session.date)}
           locationName={session.locationName}
           address={session.locationAddress}
           startTime={convertTo12HourFormat(session.startTime)}
           endTime={convertTo12HourFormat(session.endTime)}
           />
           ))*/
        }
      </div>
      <CartClearer />
    </div>
  )
}

export default withCurrentUser(ConfirmationPage)
