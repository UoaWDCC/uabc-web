import { Popup } from "@repo/shared/enums"
import type { CreateSemesterData } from "@repo/shared/types"
import { CreateSemesterPopUpFlow } from "@repo/ui/components/Generic"
import { Accordion, Button, Center, Dialog, useDisclosure, useNotice } from "@yamada-ui/react"
import { parseAsBoolean, useQueryState } from "nuqs"
import { useCallback, useState } from "react"
import {
  useCreateSemester,
  useDeleteSemester,
} from "@/services/admin/semester/AdminSemesterMutations"
import { useGetAllSemesters } from "@/services/semester/SemesterQueries"
import { SemesterScheduleAccordionItem } from "./SemesterScheduleAccordionItem"

export const AdminSemesters = () => {
  const notice = useNotice()

  const { data: allSemesters } = useGetAllSemesters()

  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set([0]))

  // Delete semester logic
  const [semesterToDelete, setSemesterToDelete] = useState<string | null>(null)
  const {
    open: openDeleteSemester,
    onOpen: onOpenDeleteSemester,
    onClose: onCloseDeleteSemester,
  } = useDisclosure()
  const deleteSemesterMutation = useDeleteSemester()
  const handleDeleteSemesterConfirm = useCallback(() => {
    if (!semesterToDelete) {
      return
    }
    deleteSemesterMutation.mutate(semesterToDelete, {
      onSuccess: () => {
        notice({
          title: "Deletion successful",
          description: "Semester has been deleted",
          status: "success",
        })
        onCloseDeleteSemester()
        setSemesterToDelete(null)
      },
      onError: () => {
        notice({
          title: "Deletion failed",
          description: "Failed to delete semester",
          status: "error",
        })
      },
    })
  }, [deleteSemesterMutation, semesterToDelete, notice, onCloseDeleteSemester])

  // Create semester logic
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
      {/* Main Admin Semesters accordion */}
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
              onDeleteSemester={(semId) => {
                setSemesterToDelete(semId)
                onOpenDeleteSemester()
              }}
              semester={sem}
            />
          ))
        ) : (
          <Center>No semesters found</Center>
        )}
      </Accordion>
      {/* Action flows and confirmations */}
      <CreateSemesterPopUpFlow
        onClose={() => {
          setOpenCreateSemester(false)
        }}
        onComplete={handleCreateSemester}
        open={!!openCreateSemester}
      />
      <Dialog
        cancel="Cancel"
        header="Delete Semester"
        onCancel={onCloseDeleteSemester}
        onClose={onCloseDeleteSemester}
        onSuccess={handleDeleteSemesterConfirm}
        open={openDeleteSemester}
        success={{
          children: "Delete",
          colorScheme: "danger",
          loading: deleteSemesterMutation.isPending,
        }}
      >
        Are you sure you want to delete this semester? This action cannot be undone.
      </Dialog>
    </>
  )
}
