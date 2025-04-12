import { notFound } from 'next/navigation'
import { z } from 'zod'

import ClientViewSessionsPageWithId from './client-page'
import { Container } from '@yamada-ui/react'

const routeContextSchema = z.object({
  params: z.promise(
    z.object({
      gameSessionId: z.coerce.number(),
    }),
  ),
})

export default async function ViewSessionsPage(ctx: z.infer<typeof routeContextSchema>) {
  const result = routeContextSchema.safeParse(ctx)

  if (!result.success) notFound()

  const gameSessionId = (await result.data.params).gameSessionId

  return (
    <Container minH="100dvh">
      <ClientViewSessionsPageWithId gameSessionId={gameSessionId} />
    </Container>
  )
}
