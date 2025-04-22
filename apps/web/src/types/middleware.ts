import z from 'zod'
import { UserSchema } from './user'

export const JWTResponseSchema = z.object({
  user: UserSchema,
  access_token: z.string(),
})

export type JWTResponse = z.infer<typeof JWTResponseSchema>
