import { useQuery } from '@tanstack/react-query'

import { QUERY_KEY } from '@/lib/utils/queryKeys'

export type MemberResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  prepaidSessions: number
}

const MOCK_MEMBERS: MemberResponse[] = Array.from({ length: 100 }, (_, i) => {
  const id = (i + 1).toString()
  const firstNames = [
    'John',
    'Jane',
    'Mike',
    'Sarah',
    'Tom',
    'Emily',
    'David',
    'Lisa',
    'James',
    'Emma',
  ]
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
  ]
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  return {
    id,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`,
    prepaidSessions: Math.floor(Math.random() * 20) + 1,
  }
})

const fetchMembers = async (): Promise<MemberResponse[]> => {
  const response = await fetch(`/api/users?member=true&verified=true`, {
    cache: 'no-store',
  })
  return response.json()
}

export const useMembers = () => {
  const query = useQuery({
    queryKey: [QUERY_KEY.MEMBERS],
    queryFn: () => MOCK_MEMBERS,
  })

  return query
}
