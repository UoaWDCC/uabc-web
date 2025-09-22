import { Body, Head, Heading, Html, Preview, Text } from "@react-email/components"

export interface BookingConfirmationEmailProps {
  weekday: string
  time: string
  sessionName: string
  sessionLocation?: string
}

export const BookingConfirmationEmail = ({
  weekday,
  time,
  sessionName,
  sessionLocation,
}: BookingConfirmationEmailProps) => {
  return (
    <Html>
      <Head title="UABC Booking Confirmation" />
      <Body>
        <Preview>
          Your booking for our {weekday} session at {sessionName} has been confirmed!
        </Preview>
        <Heading>Booking Confirmation</Heading>
        <Text>
          Your booking for our {weekday} session at {sessionName} has been confirmed!
        </Text>
        <Text>The details for your session are as follows:</Text>
        <ul>
          <li>Date: {weekday}</li>
          <li>Time: {time}</li>
          {sessionLocation && <li>Location: {sessionLocation}</li>}
        </ul>
        <Text>We'll see you on the courts! 🏸</Text>
        <Text>Kind regards,</Text>
        <Text>UABC Team</Text>
      </Body>
    </Html>
  )
}
