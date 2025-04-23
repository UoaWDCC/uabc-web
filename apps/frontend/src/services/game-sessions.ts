import "server-only"

export async function getOrCreateBookingPeriod({}: {
  semesterId: number
  bookingOpenTime: Date | string
  bookingCloseTime: Date | string
}) {
  throw new Error("Method not implemented.")
}

export async function getAttendeesFromId(gameSessionId: number) {
  console.error(gameSessionId, "not implemented")
  throw new Error("NOT IMPLEMENTED")
}
