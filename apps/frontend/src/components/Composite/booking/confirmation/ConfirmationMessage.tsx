import { CircleCheckIcon, ClockIcon } from "@yamada-ui/lucide"
import { Alert, AlertDescription, AlertIcon, AlertTitle, Text } from "@yamada-ui/react"

interface ConfirmationMessageProps {
  member: boolean
  email: string
}

export default function ConfirmationMessage({ member, email }: ConfirmationMessageProps) {
  return (
    <Alert
      alignItems="center"
      border="none"
      flexDirection="column"
      gap="md"
      justifyContent="center"
      status={member ? "success" : "warning"}
      textAlign="center"
    >
      <AlertIcon boxSize="120px" mr={0}>
        {member ? (
          <CircleCheckIcon boxSize="120px" color="success" />
        ) : (
          <ClockIcon boxSize="120px" color="yellow.500" />
        )}
      </AlertIcon>
      <AlertTitle fontSize="lg" fontWeight="medium" mr={0}>
        {member ? "Booking Confirmed" : "Booking Pending"}
      </AlertTitle>
      <AlertDescription color="tertiary" fontSize="sm" fontWeight="medium">
        {member
          ? "Booking successful! A confirmation email has been sent to "
          : "Your booking is pending payment. Payment instructions have been sent to "}
        <Text as="span" fontWeight="bold" textDecoration="underline">
          {email}
        </Text>
        .
      </AlertDescription>
    </Alert>
  )
}
