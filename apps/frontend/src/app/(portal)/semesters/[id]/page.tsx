import { Heading } from "@repo/ui/components/Primitive"
import { Container, Text } from "@yamada-ui/react"
import { getSemester } from "@/lib/api/endpoints"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const runtime = "edge"

export default async function SemesterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: semester } = await getSemester(id)

  return (
    <Container>
      <Heading.h1>Semester (Dynamic Example)</Heading.h1>
      <Heading.h2>{semester?.data?.name}</Heading.h2>
      <Text>{semester?.data?.startDate}</Text>
      <Text>{semester?.data?.endDate}</Text>
      <Text>{semester?.data?.breakStart}</Text>
      <Text>{semester?.data?.breakEnd}</Text>
      <Text>{semester?.data?.bookingOpenDay}</Text>
      <Text>{semester?.data?.bookingOpenTime}</Text>
    </Container>
  )
}
