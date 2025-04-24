import { type User, stubUser } from "@/services/stub-user"

export async function getUserFromId(userId: string) {
  return stubUser(userId)
}

export async function getUserFromEmail(email: string | null | undefined): Promise<User | null> {
  return stubUser(email || "no id")
}

/**
 * creates and inserts a 6-digit verification token into the database
 * if there are already 5 active tokens for the email, it throws an error
 */
export const insertVerificationToken = async (email: string) => {
  throw new Error(`Method not implemented.${email}`)
}

export const userCache = {
  getTag: (email: string) => `user-${email}`,
  revalidate(email: string): void {
    throw new Error(`Method not implemented.${email}`)
  },
}
