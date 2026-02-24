import { Popup } from "@repo/shared/enums"
import type { CreateSemesterData } from "@repo/shared/types"
import { CreateSemesterPopUpFlow } from "@repo/ui/components/Generic"
import { Button, useNotice } from "@yamada-ui/react"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useCallback } from "react"
import { useCreateSemester } from "@/services/admin/semester/AdminSemesterMutations"

export const AdminSemesters = () => {
  const notice = useNotice()
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
