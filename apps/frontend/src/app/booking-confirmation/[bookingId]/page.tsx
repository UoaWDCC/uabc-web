import Link from "next/link"

import { UabcHeaderText } from "@/components/Composite/UabcHeaderText"
import { CartClearer } from "@/components/Composite/booking/confirmation/CartClearer"
import ConfirmationMessage from "@/components/Composite/booking/confirmation/ConfirmationMessage"
import type { CurrentUserProps } from "@/lib/hoc/withCurrentUser"
import withCurrentUser from "@/lib/hoc/withCurrentUser"
import { Box, Button, Center, Text, VStack } from "@yamada-ui/react"

export const metadata = {
  title: "Booking Confirmation - UABC Booking Portal",
}

async function ConfirmationPage(
  props: CurrentUserProps & { params: Promise<{ bookingId: string }> },
) {
  return (
    <VStack minHeight="100dvh">
      <Center height={32} position="relative">
        <Box
          backgroundColor="gray.50"
          height="full"
          position="absolute"
          roundedBottom="50%"
          width={{ base: "120%", md: "110%" }}
          zIndex={-10}
        />

        <Link href="/">
          <UabcHeaderText />
        </Link>
      </Center>

      <VStack alignItems="center" flexGrow={1} justifyContent="center" paddingY={10}>
        {
          /**
           * // TODO
           */
          // @ts-ignore
          <ConfirmationMessage email={await props.currentUser.email} member={false} />
        }
        <Button as={Link} href="/sessions">
          Return Home
        </Button>
      </VStack>

      <VStack backgroundColor="primary" padding="md">
        <Text color="white" fontSize="xl" fontWeight="semibold">
          Rackets at the ready!
        </Text>
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
        {/* TODO: Replace with actual session data */}
      </VStack>
      <CartClearer />
    </VStack>
  )
}

export default withCurrentUser(ConfirmationPage)
