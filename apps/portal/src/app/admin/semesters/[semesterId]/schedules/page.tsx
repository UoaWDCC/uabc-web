import { Container, Spacer, VStack } from "@yamada-ui/react"
import { notFound } from "next/navigation"
import { z } from "zod"
import ScheduleCreateButton from "@/components/Composite/admin/schedules/ScheduleCreateButton"
import { SchedulesList } from "@/components/Composite/admin/schedules/SchedulesList"
import { BackNavigationBar } from "@/components/Composite/BackNavigationBar"

const routeContextSchema = z.object({
  params: z.promise(
    z.object({
      semesterId: z.coerce.number(),
    }),
  ),
})

export async function generateMetadata(ctx: z.infer<typeof routeContextSchema>) {
  const result = routeContextSchema.safeParse(ctx)

  if (!result.success) notFound()

  return {
    title: "no schedules",
  }
}

export default async function SchedulesPage(ctx: z.infer<typeof routeContextSchema>) {
  const result = routeContextSchema.safeParse(ctx)

  if (!result.success) notFound()

  const semesterId = (await result.data.params).semesterId

  return (
    <Container minH="100dvh">
      <BackNavigationBar pathName="/admin/semesters" title="Schedules">
        <Spacer />
        <ScheduleCreateButton semesterId={semesterId} />
      </BackNavigationBar>
      <VStack>
        <SchedulesList semesterId={semesterId} />
      </VStack>
    </Container>
  )
}
