import { MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import type { BeforeChangeHook } from "node_modules/payload/dist/collections/config/types"

/**
 * Validates and sets the user role based on remaining sessions.
 *
 * Sets the user role to 'member' if they are not an admin and have more than 0 remaining sessions.
 * Sets the user role to 'casual' when they have 0 or fewer remaining sessions.
 */
export const validateUserRemainingSessions: BeforeChangeHook<User> = ({ data }) => {
  if (data.role !== MembershipType.admin) {
    if ((data.remainingSessions || 0) > 0) {
      data.role = MembershipType.member
    } else {
      data.role = MembershipType.casual
    }
  }
  return data
}
