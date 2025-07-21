import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import SemesterService from "./SemesterService"

const SemesterQuery = {
  /**
   * Retrieves and caches all semesters.
   *
   * @returns A query hook that fetches all semesters
   */
  useGetSemesters: () => {
    return useQuery({
      queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
      queryFn: SemesterService.getAllSemesters,
    })
  },
} as const

export default SemesterQuery
