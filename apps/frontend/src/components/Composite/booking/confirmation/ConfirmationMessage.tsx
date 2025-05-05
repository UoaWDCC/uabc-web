import { CircleCheckIcon, ClockIcon } from "@yamada-ui/lucide"
import { Box, Center, Container, Text } from "@yamada-ui/react"

interface ConfirmationMessageProps {
  member: boolean
  email: string
}

export default function ConfirmationMessage({ member, email }: ConfirmationMessageProps) {
  return (
    <Container maxWidth={96} textWrap="pretty" width="full">
      <Center>
        {member ? (
          <CircleCheckIcon color="success" fontSize="120px" />
        ) : (
          <ClockIcon color="yellow.500" fontSize="120px" />
        )}
      </Center>
      <Box marginTop="medium" textAlign="center">
        <Text fontSize="large" fontWeight="medium">
          {member ? "Confirmed" : "Awaiting Payment"}
        </Text>
        <Text color="tertiary" fontSize="small" fontWeight="medium">
          {member
            ? "Booking successful! A confirmation email has been sent to "
            : "Your booking is pending payment. Payment instructions have been sent to "}
          <Text as="span" fontWeight="bold" textDecoration="underline">
            {email}
          </Text>
          .
        </Text>
      </Box>
    </Container>
  )
}
