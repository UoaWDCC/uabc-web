/**
 * TODO: Delete this file and implement your own user service
 */
export const stubUser = (id: string) => {
  return {
    id,
    firstName: 'Not',
    lastName: 'Implemented',
    member: true,
    prepaidSessions: 69,
  }
}

export type User = ReturnType<typeof stubUser>
