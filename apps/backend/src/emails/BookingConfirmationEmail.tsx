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

export interface BookingConfirmationEmailProps {
  date: string
  weekday: string
  time: string
  sessionName: string
  sessionLocation?: string
}

const BookingConfirmationEmail = ({
  date,
  weekday,
  time,
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
            Your booking for our {weekday} session at {sessionName} has been confirmed!
          </Preview>
          <Container className="m-0 w-full max-w-2xl p-4">
            <Heading className="m-0 text-5xl text-primary">Booking Confirmation</Heading>
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
                <li className="my-0.5">Time: {time}</li>
                {sessionLocation && (
                  <li className="my-0.5">
                    Location: {sessionName}, {sessionLocation}
                  </li>
                )}
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

BookingConfirmationEmail.PreviewProps = {
  date: "24th November",
  weekday: "Monday",
  time: "18:30",
  sessionName: "UoA Rec Center",
  sessionLocation: "123 University Rd, City",
} satisfies BookingConfirmationEmailProps

export default BookingConfirmationEmail
