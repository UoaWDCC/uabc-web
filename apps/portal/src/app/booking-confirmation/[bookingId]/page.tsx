import { Bleed, Box, Button, Center, Container, Text, VStack } from "@yamada-ui/react"
import Link from "next/link"
import { CartClearer } from "@/components/Composite/booking/confirmation/CartClearer"
import ConfirmationMessage from "@/components/Composite/booking/confirmation/ConfirmationMessage"
import { UabcHeaderText } from "@/components/Composite/UabcHeaderText"
import type { CurrentUserProps } from "@/lib/hoc/withCurrentUser"
import withCurrentUser from "@/lib/hoc/withCurrentUser"

export const metadata = {
  title: "Booking Confirmation - UABC Booking Portal",
}

async function ConfirmationPage(
  props: CurrentUserProps & { params: Promise<{ bookingId: string }> },
) {
  return (
    <Container height="100dvh">
      <Center as={Bleed} block="md" height={32} inline="md" position="relative">
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

      <Center as={VStack} flexGrow={1}>
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
      </Center>
      <Bleed block="md" inline="md">
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
      </Bleed>
      <CartClearer />
    </Container>
  )
}

export default withCurrentUser(ConfirmationPage)
