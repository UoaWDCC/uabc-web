import "server-only"

// biome-ignore lint/correctness/noUnusedVariables: API not implemented
export async function getOrCreateBookingPeriod(params: {
  semesterId: number
  bookingOpenTime: Date | string
  bookingCloseTime?: Date | string
}) {
  throw new Error("Method not implemented.")
}

export async function getAttendeesFromId(gameSessionId: number) {
  console.error(gameSessionId, "not implemented")
  throw new Error("NOT IMPLEMENTED")
}
