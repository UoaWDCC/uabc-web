import { Popup } from "@repo/shared/enums"
import type { CreateSemesterData } from "@repo/shared/types"
import { CreateSemesterPopUpFlow } from "@repo/ui/components/Generic"
import { Accordion, Button, Center, useNotice } from "@yamada-ui/react"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useCallback, useState } from "react"
import { useCreateSemester } from "@/services/admin/semester/AdminSemesterMutations"
import { useGetAllSemesters } from "@/services/semester/SemesterQueries"
import { SemesterScheduleAccordionItem } from "./SemesterScheduleAccordionItem"

export const AdminSemesters = () => {
  const notice = useNotice()

  const { data: allSemesters } = useGetAllSemesters()

  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set([0]))

  const [openCreateSemester, setOpenCreateSemester] = useQueryState(
    Popup.CREATE_SEMESTER,
    parseAsBoolean,
  )
  const createSemesterMutation = useCreateSemester()
  const handleCreateSemester = useCallback(
    (newSemester: CreateSemesterData) => {
      createSemesterMutation.mutate(newSemester, {
        onSuccess: () => {
          notice({
            title: "Creation successful",
            description: "Semester has been created",
            status: "success",
          })
        },
        onError: () => {
          notice({
            title: "Creation failed",
            description: "Failed to create semester",
            status: "error",
          })
        },
      })
    },
    [createSemesterMutation, notice],
  )

  return (
    <>
      <Button
        colorScheme="primary"
        onClick={() => {
          setOpenCreateSemester(true)
        }}
        placeSelf="start"
      >
        Create Semester
      </Button>
      <Accordion
        defaultIndex={[0]}
        multiple
        onChange={(openIndexes) => {
          setExpandedIndexes(new Set(openIndexes as number[]))
        }}
      >
        {allSemesters?.data.length ? (
          allSemesters.data.map((sem, index) => (
            <SemesterScheduleAccordionItem
              enabled={expandedIndexes.has(index)}
              key={sem.id}
              semester={sem}
            />
          ))
        ) : (
          <Center>No semesters found</Center>
        )}
      </Accordion>
      <CreateSemesterPopUpFlow
        onClose={() => {
          setOpenCreateSemester(false)
        }}
        onComplete={handleCreateSemester}
        open={!!openCreateSemester}
      />
    </>
  )
}
