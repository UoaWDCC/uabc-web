import { BsCheckCircle, BsClock } from "react-icons/bs"

interface ConfirmationMessageProps {
  member: boolean
  email: string
}

export default function ConfirmationMessage({ member, email }: ConfirmationMessageProps) {
  return (
    <div className="w-full max-w-96 text-pretty">
      {member ? (
        <BsCheckCircle className="mx-auto text-success" size={120} />
      ) : (
        <BsClock className="mx-auto text-yellow-500" size={120} />
      )}
      <div className="mt-4 space-y-2 text-center">
        <p className="font-medium text-lg">{member ? "Confirmed" : "Awaiting Payment"}</p>
        <p className="font-medium text-sm text-tertiary">
          {member ? (
            <>
              Booking successful! A confirmation email has been sent to{" "}
              <strong>
                <u>{email}</u>
              </strong>
              .
            </>
          ) : (
            <>
              Your booking is pending payment. Payment instructions have been sent to{" "}
              <strong>
                <u>{email}</u>
              </strong>
              .
            </>
          )}
        </p>
      </div>
    </div>
  )
}
