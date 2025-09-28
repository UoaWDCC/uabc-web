import { MAX_CASUAL_BOOKINGS, MAX_MEMBER_BOOKINGS } from "../constants"
import type { User } from "../payload-types"
import { MembershipType } from "../types"

export const getMaxBookingSize = (user: User) => {
  if (user.role === MembershipType.casual) {
    return MAX_CASUAL_BOOKINGS
  }
  return MAX_MEMBER_BOOKINGS
}
