import { notFound } from 'next/navigation'
import { z } from 'zod'

import ClientViewSessionsPageWithId from './client-page'

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
    <div className="mx-4 flex min-h-dvh flex-col">
      <ClientViewSessionsPageWithId gameSessionId={gameSessionId} />
    </div>
  )
}
