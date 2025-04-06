import { PayloadRequest } from 'payload'
import { MembershipType } from '@/types/types'

export const adminAccessControl = ({
  req,
}: {
  req: PayloadRequest
}): boolean | Promise<boolean> => {
  const user = req.user
  // Only allow access for admins
  return !!(user && user.role == MembershipType.admin)
}
