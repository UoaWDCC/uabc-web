import React from 'react'
import { BsCheckCircle, BsClock } from 'react-icons/bs'

interface ConfirmationMessageProps {
  member: boolean
  email: string
}

export default function ConfirmationMessage({ member, email }: ConfirmationMessageProps) {
  return (
    <div className="w-full max-w-96 text-pretty">
      {member ? (
        <BsCheckCircle size={120} className="mx-auto text-success" />
      ) : (
        <BsClock size={120} className="mx-auto text-yellow-500" />
      )}
      <div className="mt-4 space-y-2 text-center">
        <p className="text-lg font-medium">{member ? 'Confirmed' : 'Awaiting Payment'}</p>
        <p className="text-sm font-medium text-tertiary">
          {member ? (
            <>
              Booking successful! A confirmation email has been sent to{' '}
              <strong>
                <u>{email}</u>
              </strong>
              .
            </>
          ) : (
            <>
              Your booking is pending payment. Payment instructions have been sent to{' '}
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
