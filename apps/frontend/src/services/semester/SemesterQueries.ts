import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "@/services"
import SemesterService from "./SemesterService"

/**
 * Retrieves and caches all semesters.
 *
 * @returns A query hook that fetches all semesters
 */
export const useGetAllSemesters = () => {
  return useQuery({
    queryKey: [QueryKeys.SEMESTER_QUERY_KEY],
    queryFn: SemesterService.getAllSemesters,
  })
}

/**
 * Retrieves and caches the current semester.
 *
 * @returns A query hook that fetches the current semester
 */
export const useGetCurrentSemester = () => {
  return useQuery({
    queryKey: [QueryKeys.SEMESTER_QUERY_KEY, "current"],
    queryFn: SemesterService.getCurrentSemester,
  })
}
