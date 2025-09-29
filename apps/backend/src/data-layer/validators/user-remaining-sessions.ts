import { MembershipType } from "@repo/shared"
import type { User } from "@repo/shared/payload-types"
import type { BeforeChangeHook } from "node_modules/payload/dist/collections/config/types"

/**
 * Validates and sets the user role based on remaining sessions.
 *
 * If the user is not an admin and has more than 0 remaining sessions, set role to 'member'.
 * If the user has 0 or fewer remaining sessions, set role to 'casual'.
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
