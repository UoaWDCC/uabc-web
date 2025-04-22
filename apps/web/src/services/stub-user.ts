import { PlayLevel } from '@/types/types'

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
    email: 'not@implemented.com',
    playLevel: PlayLevel.beginner,
  } as const
}

export type User = ReturnType<typeof stubUser>
