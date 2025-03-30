import { notFound } from 'next/navigation'
import { z } from 'zod'

import ScheduleCreateButton from '@/components/admin/schedules/ScheduleCreateButton'
import { SchedulesList } from '@/components/admin/schedules/SchedulesList'
import { BackNavigationBar } from '@/components/BackNavigationBar'

// TODO: properly verify
const routeContextSchema = z.object({})

export async function generateMetadata(ctx: z.infer<typeof routeContextSchema>) {
  const result = routeContextSchema.safeParse(ctx)

  if (!result.success) notFound()

  return {
    title: `no schedules`,
  }
}

export default async function SchedulesPage(ctx: z.infer<typeof routeContextSchema>) {
  const result = routeContextSchema.safeParse(ctx)

  if (!result.success) notFound()

  const semesterId = result.data.params.semesterId

  return (
    <div className="max-w-dvw relative flex min-h-dvh flex-col overflow-x-hidden bg-background px-4">
      <BackNavigationBar title={`NOOOOO schedules`} pathName="/admin/semesters" className="mb-4">
        <ScheduleCreateButton semesterId={semesterId} />
      </BackNavigationBar>
      <div className="mb-4 flex flex-col gap-4 empty:grow empty:after:grid empty:after:h-full empty:after:w-full empty:after:grow empty:after:place-items-center empty:after:text-lg empty:after:font-medium empty:after:text-tertiary empty:after:content-['No_schedules_set']">
        <SchedulesList semesterId={semesterId} />
      </div>
    </div>
  )
}
