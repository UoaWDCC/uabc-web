import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import { TailwindConfig } from "./_components/TailwindConfig"

/**
 * Props for the booking confirmation email template.
 */
export interface BookingConfirmationEmailProps {
  /**
   * The date of the booking
   * Intended to be in D MMMM dayjs format (e.g., "24th November")
   */
  date: string
  /**
   * The day of the week the booking falls on
   * Intended to be in dddd dayjs format and pre-capitalized (e.g., "Monday")
   */
  weekday: string
  /**
   * The start time of the booking
   * Intended to be in HH:mm dayjs format or similar (e.g., "18:30")
   */
  startTime: string
  /**
   * The end time of the booking
   * Intended to be in HH:mm dayjs format or similar (e.g., "20:30")
   */
  endTime: string
  /**
   * The name of the session the booking is for
   * E.g., "UoA Rec Center"
   */
  sessionName?: string
  /**
   * The location of the session the booking is for
   * E.g., "17 Symonds Street"
   */
  sessionLocation?: string
}

/**
 * The template for the booking confirmation email sent to users.
 *
 * @param date The date of the booking (e.g., "24th November")
 * @param weekday The day of the week (e.g., "Monday")
 * @param startTime The start time of the booking (e.g., "18:30")
 * @param endTime The end time of the booking (e.g., "20:30")
 * @param sessionName The name of the session (e.g., "UoA Rec Center")
 * @param sessionLocation The location of the session (e.g., "17 Symonds Street")
 * @returns The booking confirmation email template.
 */
const BookingConfirmationEmail = ({
  date,
  weekday,
  startTime,
  endTime,
  sessionName,
  sessionLocation,
}: BookingConfirmationEmailProps) => {
  return (
    <Html>
      <TailwindConfig>
        <Head title="UABC Booking Confirmation">
          <Font
            fallbackFontFamily="Arial"
            fontFamily="Geist"
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap",
              format: "woff2",
            }}
          />
        </Head>
        <Body className="rounded-2xl bg-white font-medium font-sans text-md">
          <Preview>
            Your booking for our {weekday} session at {sessionName ?? ""} has been confirmed!
          </Preview>
          <Container className="m-0 w-full max-w-2xl p-4">
            <Heading className="m-0 text-5xl text-blue-500">Booking Confirmation</Heading>
            <Hr className="my-4" style={{ borderTopColor: "#303030" }} />
            <Section>
              <Text className="m-0 mb-2 font-medium text-md">
                Your booking for our {weekday} session at {sessionName} has been confirmed!
              </Text>
            </Section>
            <Section className="my-2">
              <Row className="my-1 font-medium text-md">
                The details for your session are as follows:
              </Row>
              <ul className="m-0 list-disc">
                <li className="my-0.5">
                  Date: {weekday} {date}
                </li>
                <li className="my-0.5">
                  Time: {startTime} - {endTime}
                </li>
                <li className="my-0.5">
                  Location: {sessionName}, {sessionLocation}
                </li>
              </ul>
            </Section>
            <Text className="my-4 font-medium text-md">We'll see you on the courts! 🏸</Text>
            <Section className="my-4 gap-0">
              <Text className="m-0 font-medium text-md">Kind regards,</Text>
              <Text className="m-0 font-medium text-md">UABC Team</Text>
            </Section>
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  )
}

export default BookingConfirmationEmail
